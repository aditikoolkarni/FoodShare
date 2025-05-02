const { Post } = require("../models/post.model");
const statusController = require("./status.controller");

const create = async (req, res) => {
 
  const { user_id,type, description, quantity, pickup_location, expiry_date } =
    req.body;
  try {
    const post = new Post({
      user_id,
      type,
      description,
      quantity,
      pickup_location,
      expiry_date,
    });
    await post.save();

    const status = await statusController.create(post._id); // Create a status for the post
    if (!status) {
      return res.status(500).json({ message: "Error creating status" });
    }
    
    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
};

const AllPosts = async (req,res) =>{
    try {
        const { type, expirySoon, lat, long } = req.query;

    let filter = {};

    // 1. Filter by Type
    if (type) {
      filter.type = type;
    }

    // 2. Filter by Expiry Soon (e.g., posts expiring within next 3 days)
    if (expirySoon === 'true') {
      const now = new Date();
      const soon = new Date();
      soon.setDate(soon.getDate() + 3);
      filter.expiry_date = { $lte: soon, $gte: now };
    }

    // 3. Fetch posts
    let posts = await Post.find(filter).populate('user_id', 'username email');

    // 4. (Mocked) Distance Filter
    if (lat && long) {
      const userLat = parseFloat(lat);
      const userLong = parseFloat(long);

      posts = posts.map(post => {
        const postLat = post.pickup_location?.coordinates?.lat;
        const postLong = post.pickup_location?.coordinates?.long;

        if (postLat != null && postLong != null) {
          const distance = Math.sqrt(
            Math.pow(userLat - postLat, 2) + Math.pow(userLong - postLong, 2)
          );

          return {
            ...post.toObject(),
            mockDistance: distance.toFixed(2)
          };
        }

        return post.toObject();
      });

      // Optional: sort by distance
      posts.sort((a, b) => a.mockDistance - b.mockDistance);
    }
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts", error });
    }
}

module.exports = { create, AllPosts};
