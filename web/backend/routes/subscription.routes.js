import {Router} from 'express';
import {
    createSubscription, deleteUserSubscription,
    getUserSubscriptions,
    updateUserSubscription,
    cancelUserSubscription, getUpcomingRenewals, renewSubscription
} from "../controllers/subscription.controller.js";
import {authorize} from "../middleware/auth.middleware.js";

const subscriptionRouter = new Router();

subscriptionRouter.get('/', (req, res) => {
    res.send({title: "Give User ID to get Subscriptions of the User."});
})

    subscriptionRouter.get('/:id',authorize, getUserSubscriptions)

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.post('/:id/renew', authorize, renewSubscription);


subscriptionRouter.put('/:id', authorize, updateUserSubscription)

subscriptionRouter.delete('/:id', authorize, deleteUserSubscription)


subscriptionRouter.put('/:id/cancel', authorize, cancelUserSubscription)

subscriptionRouter.get('/:id/upcoming-renewals', authorize, getUpcomingRenewals)

export {subscriptionRouter};

