const { User } = require('../models');

const userController = {
    getAllUsers(req, res) {
        User.find({})
            .then(UserData => res.json(UserData))
            .catch(err => res.status(500).json(err));
    },

    // Get a user by id

    getUserById(req, res) {
        User.findById(req.params.userId)
            .then(userData => res.json(userData))
            .catch(err => res.status(500).json(err));
    },

    // New user creation
    createUser(req, res) {
        User.create(req.body)
            .then(userData => res.json(userData))
            .catch(err => res.status(500).json(err));
    },
    // Update Users by ID

    updateUserById(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId }, req.body, { new: true })
            .then(userData => {
                if (!userData) {
                    return res.status(404).json({ message: 'User not found' });
                }
                res.json(userData);
            })
            .catch(err => res.status(500).json(err));
    },

    // Delete user and/or users and the thoughts associated with them

    deleteUserById(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
            .then(userData => {
                if (!userData) {
                    return res.status(404).json({ message: 'User not found' });
                }
                res.json({ message: 'User deleted successfully' });
            })
            .catch(err => res.status(500).json(err));
    },

    // Add friend
    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.body.friendId || req.params.friendId } },
            { new: true }
        )
            .then(userData => {
                if (!userData) {
                    return res.status(404).json({ message: 'User not found' });
                }
                res.json(userData);
            })
            .catch(err => res.status(500).json(err));
    },

    // Delete friend

    removeFriend({ params }, res) {
        User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { friends: params.friendId } },
          { new: true }
        )
          .then((dbUserData) => {
            if (!dbUserData) {
              return res.status(404).json({ message: "No user with this id!" });
            }
            // Check if friend was deleted
            const removed = !dbUserData.friends.includes(params.friendId);
            // return response with message
            if (removed) {
              res.json({ message: "Friend removed successfully!", dbUserData });
            } else {
              res.json(dbUserData);
            }
          })
          .catch((err) => res.status(400).json(err));
      },
    };

module.exports = userController