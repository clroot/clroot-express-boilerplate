import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '/database';

/**
 * Enum for User Role
 * @readonly
 * @enum {string}
 * */
export const Role = {
  USER: 'ROLE_USER',
  ADMIN: 'ROLE_ADMIN',
};

class User extends Model {
  /**
   * @param {string} email
   * @return {Promise<User>}
   * */
  static async findByEmail(email) {
    return await User.findOne({
      where: {
        email,
      },
    });
  }

  /**
   * set user password as hashed
   * @param {string} password
   * */
  async setPassword(password) {
    this.password = await bcrypt.hash(password, 10);
    await this.save();
  }

  /**
   * compare given password with User's hashed password
   * @param {string} password
   * @return {Promise<Boolean>} password compare result
   * */
  async checkPassword(password) {
    return await bcrypt.compare(password, this.password);
  }
}

User.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    field: 'user_id',
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.ENUM({
      values: Object.values(Role),
    }),
    defaultValue: Role.USER,
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  indexes: [
    {
      unique: true,
      fields: ['email'],
    },
  ],
});

export default User;