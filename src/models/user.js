import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '/database';

class User extends Model {
  static async findByEmail(email) {
    return await User.findOne({
      where: {
        email,
      },
    });
  }

  async setPassword(password) {
    this.password = await bcrypt.hash(password, 10);
  }
}

User.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
});

export default User;