import User from '../models/User.js'

const userController = {
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.json(users);
        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    },
    delete: async (req, res) => {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.json({msg: "Deleted a User"});
        }
        catch (error) {
            return res.status(500).json({msg: error.message});
        }
    },
    updateUserInfo: async (req, res) => {
        try {
          const { fullname, phone, address } = req.body;
          const userId = req.user.id;
    
          // Lấy avatar từ file nếu có, còn không giữ nguyên
          const avatar = req.file ? req.file.path : undefined;
    
          // Tạo object cập nhật
          const updatedFields = {
            ...(fullname && { fullname }),
            ...(phone && { phone }),
            ...(address && { address }),
            ...(avatar && { avatar }),
          };
    
          const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updatedFields },
            { new: true }
          );
    
          if (!updatedUser) {
            return res.status(404).json({ msg: "User not found" });
          }
    
          res.json({
            msg: "Cập nhật thông tin thành công",
            user: updatedUser,
          });
        } catch (err) {
          res.status(500).json({ msg: err.message });
        }
      },
      getUserInfo: async (req, res) => {
        try {
          const userId = req.user.id;
      
          const user = await User.findById(userId).select("-password"); // không trả về password
      
          if (!user) {
            return res.status(404).json({ msg: "Không tìm thấy người dùng" });
          }
      
          res.json({ user });
        } catch (error) {
          res.status(500).json({ msg: error.message });
        }
      },
      
}

export default userController