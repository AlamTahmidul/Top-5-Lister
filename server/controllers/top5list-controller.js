const Top5List = require('../models/top5list-model');
const User = require('../models/user-model');

const asyncFindUser = async (list, userId) => {
    await User.findOne({ email: list.ownerEmail }, (err, user) => {
        // console.log("user._id: " + user._id);
        // console.log("req.userId: " + req.userId);
        if (err) return {status: 500, json: {success: false, error: err}};
        if (user._id == userId) {
            // console.log("correct user!");
            return {status: 200, json: {success: true}};
        }
        else {
            // console.log("incorrect user!");
            return {status: 400, json: {success: false, error: "Authentication Error"}}
        }
    });
};
module.exports.createTop5List = (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'Improperly formatted request',
        })
    }

    const top5List = new Top5List(body);
    // console.log("creating top5List: " + JSON.stringify(top5List));
    if (!top5List) {
        return res.status(400).json({
            success: false,
            error: 'Improperly formatted request',
        })
    }

    // REMEMBER THAT OUR AUTH MIDDLEWARE GAVE THE userId TO THE req
    // console.log("top5List created for " + req.userId);
    User.findOne({ _id: req.userId }, (err, user) => {
        // console.log("user found: " + JSON.stringify(user));
        top5List.ownerEmail = user.email;
        user.top5Lists.push(top5List._id);
        user
            .save()
            .then(() => {
                console.log(top5List);
                top5List
                    .save()
                    .then(() => {
                        return res.status(200).json({
                            success: true,
                            top5List: top5List
                        })
                    })
                    .catch(err => {
                        return res.status(400).json({
                            success: false,
                            error: 'Top 5 List Not Created!',
                        })
                    })
            });
    })
};
module.exports.deleteTop5List = async (req, res) => {
    // console.log("delete Top 5 List with id: " + JSON.stringify(req.params.id));
    // console.log("delete " + req.params.id);
    Top5List.findById({ _id: req.params.id }, (err, top5List) => {
        console.log("top5List found: " + JSON.stringify(top5List));
        if (err) {
            return res.status(404).json({
                success: false,
                error: 'Top 5 List not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        const user = asyncFindUser(top5List, req.userId);
        if (user.status === 200) { // YES IT DOES
            Top5List.findOneAndDelete({ _id: req.params.id }, () => {
                return res.status(200).json({ success: true });
            }).catch(err => res.status(500).json({ success: false, error: err }))
        } else { // ERROR OR LIST DOES NOT BELONG TO USER
            res.status(user.status).json(user.json);
        }
    })
};
module.exports.getTop5ListById = async (req, res) => {
    // console.log("Find Top 5 List with id: " + JSON.stringify(req.params.id));

    await Top5List.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        // console.log("Found list: " + JSON.stringify(list));

        // DOES THIS LIST BELONG TO THIS USER?
        const user = asyncFindUser(list, req.userId);
        if (user.status === 200) { // YES IT DOES
            return res.status(200).json({ success: true, top5List: list });
        } else {
            return res.status(user.status).json(user.json);
        }

    }).catch(err => res.status(500).json({ success: false, error: err }))
};
module.exports.getTop5ListPairs = async (req, res) => {
    // console.log("getTop5ListPairs");
    await User.findOne({ _id: req.userId }, (err, user) => {
        if (err) return res.status(500).json({ success: false, error: err });
        async function asyncFindList(email) {
            await Top5List.find({ ownerEmail: email }, (err, top5Lists) => {
                if (err) {
                    return res.status(500).json({ success: false, error: err })
                }
                if (!top5Lists) {
                    return res
                        .status(404)
                        .json({ success: false, error: 'Top 5 Lists not found' })
                }
                else {
                    console.log("Send the Top5List pairs");
                    // PUT ALL THE LISTS INTO ID, NAME PAIRS
                    let pairs = [];
                    for (let key in top5Lists) {
                        let list = top5Lists[key];
                        let pair = {
                            _id: list._id,
                            name: list.name
                        };
                        pairs.push(pair);
                    }
                    return res.status(200).json({ success: true, idNamePairs: pairs })
                }
            }).catch(err => res.status(500).json({ success: false, error: err }))
        }
        asyncFindList(user.email);
    }).catch(err => res.status(500).json({ success: false, error: err }))
};
module.exports.getTop5Lists = async (req, res) => {
    await Top5List.find({ isPublished: true }, (err, top5Lists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        };
        if (!top5Lists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Top 5 Lists not found` });
        };
        return res.status(200).json({ success: true, data: top5Lists })
    }).catch(err => res.status(500).json({ success: false, error: err }));
};
module.exports.updateTop5List = async (req, res) => {
    const body = req.body;
    // console.log("\nupdateTop5List: " + JSON.stringify(body));
    // console.log("req.body.name, req.body.items: " + req.body.name + ", " + req.body.items);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        });
    };

    Top5List.findOne({ _id: req.params.id }, (err, top5List) => {
        // console.log("top5List found: " + JSON.stringify(top5List));
        if (err) {
            return res.status(404).json({
                success: false,
                error: 'Top 5 List not found!',
            });
        };
        // console.log("\n\nLIST EXISTS!");

        // DOES THIS LIST BELONG TO THIS USER?
        const user = asyncFindUser(top5List, req.userId);
        if (user.status === 200) {
            list.name = body.top5List.name;
            list.items = body.top5List.items;
            list.likes = body.top5List.likes;
            list.dislikes = body.top5List.dislikes;
            list.views = body.top5List.views;
            list.isPublished = body.top5List.isPublished;
            list.comments = body.top5List.comments;
            list
                .save()
                .then(() => {
                    // console.log("SUCCESS!!!");
                    return res.status(200).json({
                        success: true,
                        id: list._id,
                        message: 'Top 5 List updated!',
                    })
                })
                .catch(err => {
                    // console.log("FAILURE: " + JSON.stringify(error));
                    return res.status(404).json({
                        success: false,
                        error: 'Top 5 List not updated!',
                    })
                });
        };
    });
};