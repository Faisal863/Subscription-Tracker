import sub from '../models/sub.model.js'
import { workflowClient } from '../config/upstash.js'
import { SERVER_URL } from '../config/env.js'
import {sendReminderEmail} from "../utils/send-email.js";

// export const createSubscription = async (req, res, next) => {
//     try {
//         const subscription = await sub.create({
//             ...req.body,
//             user: req.user._id,
//         });
//
//         const { workflowRunId } = await workflowClient.trigger({
//             url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
//             body: {
//                 subscriptionId: subscription.id,
//             },
//             headers: {
//                 'content-type': 'application/json',
//             },
//             retries: 0,
//         })
//
//         await subscription.populate('user');  // populate user info if you store user ref
//
//         await sendReminderEmail({
//             to: subscription.user.email,
//             type: 'subscription-created',  // or whatever label matches your emailTemplates
//             subscription,
//         });
//
//         res.status(201).json({ success: true, data: { subscription } });
//     } catch (e) {
//         next(e);
//     }
// }

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await sub.create({
            ...req.body,
            user: req.user._id,
        });

        // Trigger the workflow for reminders, if needed
        await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id,
            },
            headers: {
                'content-type': 'application/json',
            },
            retries: 0,
        });

        await subscription.populate('user'); // populate user info if you store user ref

        // Send subscription created email
        await sendReminderEmail({
            to: subscription.user.email,
            type: 'subscription-created',  // New label added in emailTemplates
            subscription,
        });

        res.status(201).json({ success: true, data: { subscription } });
    } catch (e) {
        next(e);
    }
};

export const getUserSubscriptions = async (req, res, next) => {
    try {
        // Check if the user is the same as the one in the token
        if(req.user.id !== req.params.id) {
            const error = new Error('You are not the owner of this account');
            error.status = 401;
            throw error;
        }

        const subscriptions = await sub.find({ user: req.params.id });

        res.status(200).json({ success: true, data: subscriptions });
    } catch (e) {
        next(e);
    }
}


export const renewSubscription = async (req, res, next) => {
    try {
        const subscription = await sub.findById(req.params.id);
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        const now = new Date();
        const renewalStart = (subscription.renewalDate && subscription.renewalDate > now)
            ? new Date(subscription.renewalDate)
            : now;

        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30
        };

        const daysToAdd = renewalPeriods[subscription.frequency] || 30;

        // Extend from current or future renewalDate
        renewalStart.setDate(renewalStart.getDate() + daysToAdd);

        subscription.startDate = now; // Optional: track when it was renewed
        subscription.renewalDate = renewalStart;
        await subscription.save();

        res.status(200).json({ success: true, data: subscription });
    } catch (err) {
        next(err);
    }
};



export const updateUserSubscription = async (req, res, next) => {
    try {
        const subscriptionId = req.params.id;

        // Find the subscription first
        const subscription = await sub.findById(subscriptionId);

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.status = 404;
            throw error;
        }

        // Check if the logged-in user is the owner
        if (subscription.user.toString() !== req.user.id) {
            const error = new Error('You are not authorized to update this subscription');
            error.status = 401;
            throw error;
        }

        // Update the subscription
        const updatedSubscription = await sub.findByIdAndUpdate(
            subscriptionId,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, data: updatedSubscription });
    } catch (e) {
        next(e);
    }
}


export const deleteUserSubscription = async (req, res, next) => {
    try {
        const subscriptionId = req.params.id;

        // Find the subscription first
        const subscription = await sub.findById(subscriptionId);

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.status = 404;
            throw error;
        }

        // Check if the logged-in user is the owner
        if (subscription.user.toString() !== req.user.id) {
            const error = new Error('You are not authorized to delete this subscription');
            error.status = 401;
            throw error;
        }

        // Delete the subscription
        await sub.findByIdAndDelete(subscriptionId);

        res.status(200).json({ success: true, message: 'Subscription deleted successfully' });
    } catch (e) {
        next(e);
    }
}

export const cancelUserSubscription = async (req, res, next) => {
    try {
        const subscriptionId = req.params.id;

        // Find the subscription
        const subscription = await sub.findById(subscriptionId);

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.status = 404;
            throw error;
        }

        // Check if the logged-in user is the owner
        if (subscription.user.toString() !== req.user.id) {
            const error = new Error('You are not authorized to cancel this subscription');
            error.status = 401;
            throw error;
        }

        // Update subscription status to 'cancelled'
        subscription.status = 'inactive';
        await subscription.save();

        res.status(200).json({ success: true, message: 'Subscription cancelled successfully', data: subscription });
    } catch (e) {
        next(e);
    }
}

export const getUpcomingRenewals = async (req, res, next) => {
    try {
        // Get user ID from params
        if (req.user.id !== req.params.id) {
            const error = new Error('You are not the owner of this account');
            error.status = 401;
            throw error;
        }

        const today = new Date();

        const upcomingRenewals = await sub.find({
            user: req.params.id,  // Use the ID from params
            renewalDate: { $gte: today },
            status: "active"
        }).sort({ renewalDate: 1 });

        res.status(200).json({
            success: true,
            count: upcomingRenewals.length,
            data: upcomingRenewals
        });
    } catch (error) {
        next(error);
    }
};
