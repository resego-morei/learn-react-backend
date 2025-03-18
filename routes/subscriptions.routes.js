import { Router } from "express";
import { authorize } from "../middleware/auth.middleware.js";
import createSubscription, { 
    getUserSubscriptions,
    getAllSubscriptions,
    getSubscriptionsDetails,
    putUpdateSubscriptions,
    deleteSubscriptions,
    putCancelSubscriptions,
    getUpcomingRenewals
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

// Get all subscriptions (admin or authorized route)
subscriptionRouter.get('/', authorize, getAllSubscriptions);

// Get subscription details by ID
subscriptionRouter.get('/:id', authorize, getSubscriptionsDetails);

// Create a new subscription
subscriptionRouter.post('/', authorize, createSubscription);

// Update a subscription
subscriptionRouter.put('/:id', authorize, putUpdateSubscriptions);

// Delete a subscription
subscriptionRouter.delete('/:id', authorize, deleteSubscriptions);

// Get user's subscriptions
subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

// Cancel a subscription
subscriptionRouter.put('/:id/cancel', authorize, putCancelSubscriptions);

// Get upcoming renewals
subscriptionRouter.get('/upcoming-renewals', authorize, getUpcomingRenewals);

export default subscriptionRouter;