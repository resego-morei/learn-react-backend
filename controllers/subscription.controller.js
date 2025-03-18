import Subscription from '../models/subscriptions.model.js'
import { workflowClient } from '../config/upstash.js'
import { SERVER_URL } from '../config/env.js'


export const createSubscription = async (req, res, next) => {
    try {
      const subscription = await Subscription.create({
        ...req.body,
        user: req.user._id,
      });
  
      const { workflowRunId } = await workflowClient.trigger({
        url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
        body: {
          subscriptionId: subscription.id,
        },
        headers: {
          'content-type': 'application/json',
        },
        retries: 0,
      })
  
      res.status(201).json({ success: true, data: { subscription, workflowRunId } });
    } catch (e) {
      next(e);
    }
  }
  
export const getUserSubscriptions = async (req, res, next) => {
    try {
        // Check if the user is the same as the one in the token
        if(req.user.id !== req.params.id) {
        const error = new Error('You are not the owner of this account');
        error.status = 401;
        throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id });

        res.status(200).json({ success: true, data: subscriptions });
    } catch (e) {
        next(e);
    }
}

// Get all subscriptions
export const getAllSubscriptions = async (req, res, next) => {
    try {
        // Optional: Add pagination and filtering
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const subscriptions = await Subscription.find()
            .skip(skip)
            .limit(limit)
            .populate('user', 'name email'); // Optionally populate user details

        const total = await Subscription.countDocuments();

        res.status(200).json({
            success: true, 
            count: subscriptions.length,
            total,
            page,
            data: subscriptions
        });
    } catch (error) {
        next(error);
    }
};

// Get subscription details by ID
export const getSubscriptionsDetails = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id)
            .populate('user', 'name email'); // Optionally populate user details

        if (!subscription) {
            return next({
                message: 'Subscription not found',
                statusCode: 404
            });
        }

        // Optional: Add authorization check if needed
        if (subscription.user._id.toString() !== req.user.id) {
            return next({
                message: 'Not authorized to access this subscription',
                statusCode: 401
            });
        }

        res.status(200).json({success: true, data: subscription});
    } catch (error) {
        next(error);
    }
};

// Update subscription
export const putUpdateSubscriptions = async (req, res, next) => {
    try {
        // Find the subscription first
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            return next({
                message: 'Subscription not found',
                statusCode: 404
            });
        }

        // Check if the user owns the subscription
        if (subscription.user.toString() !== req.user.id) {
            return next({
                message: 'Not authorized to update this subscription',
                statusCode: 401
            });
        }

        // Update the subscription
        const updatedSubscription = await Subscription.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { 
                new: true, 
                runValidators: true 
            }
        );

        res.status(200).json({success: true, data: updatedSubscription});
    } catch (error) {
        next(error);
    }
};

// Delete subscription
export const deleteSubscriptions = async (req, res, next) => {
    try {
        // Find the subscription first
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            return next({
                message: 'Subscription not found',
                statusCode: 404
            });
        }

        // Check if the user owns the subscription
        if (subscription.user.toString() !== req.user.id) {
            return next({
                message: 'Not authorized to delete this subscription',
                statusCode: 401
            });
        }

        // Delete the subscription
        await Subscription.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true, 
            message: 'Subscription successfully deleted'
        });
    } catch (error) {
        next(error);
    }
};

// Cancel subscription
export const putCancelSubscriptions = async (req, res, next) => {
    try {
        // Find the subscription first
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            return next({
                message: 'Subscription not found',
                statusCode: 404
            });
        }

        // Check if the user owns the subscription
        if (subscription.user.toString() !== req.user.id) {
            return next({
                message: 'Not authorized to cancel this subscription',
                statusCode: 401
            });
        }

        // Update subscription status to cancelled
        const cancelledSubscription = await Subscription.findByIdAndUpdate(
            req.params.id, 
            { status: 'cancelled' }, 
            { 
                new: true, 
                runValidators: true 
            }
        );

        res.status(200).json({
            success: true, 
            message: 'Subscription successfully cancelled',
            data: cancelledSubscription
        });
    } catch (error) {
        next(error);
    }
};

// Get upcoming renewals
export const getUpcomingRenewals = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Find subscriptions with renewal dates in the future
        const upcomingRenewals = await Subscription.find({
            user: req.user.id,
            status: 'active',
            renewalDate: { $gt: new Date() }
        })
        .sort({ renewalDate: 1 }) // Sort by closest renewal date
        .skip(skip)
        .limit(limit)
        .populate('user', 'name email');

        const total = await Subscription.countDocuments({
            user: req.user.id,
            status: 'active',
            renewalDate: { $gt: new Date() }
        });

        res.status(200).json({
            success: true,
            count: upcomingRenewals.length,
            total,
            page,
            data: upcomingRenewals
        });
    } catch (error) {
        next(error);
    }
};




export default createSubscription;