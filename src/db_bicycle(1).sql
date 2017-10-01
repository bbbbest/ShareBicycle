-- 删除数据库
/**
drop database SharingBicycleSystem;
**/
-- 创建数据库
/**
create database SharingBicycleSystem;
use SharingBicycleSystem;
**/

/*
|> 项目里的bean应和数据库保持高度一致，类名与表名一致，变量与列名保持一致，并重写tostring()方法，具体为： class_name:[field:field_value,...]
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `adminRole`
-- ----------------------------
DROP TABLE IF EXISTS `adminRole`;
CREATE TABLE `adminRole` (
  `adminRoleId` int(2) NOT NULL AUTO_INCREMENT,
  `requireUser` boolean default false NOT NULL,
  `updateUser` boolean default false NOT NULL,
  `requireActivity` boolean default false NOT NULL,
  `updateActivity` boolean default false NOT NULL,
  `requireAdmin` boolean default false NOT NULL,
  `updateAdmin` boolean default false NOT NULL,
  `requireAdvice` boolean default false NOT NULL,
  `updateAdvice` boolean default false NOT NULL,
  `requireBicycle` boolean default false NOT NULL,
  `updateBicycle` boolean default false NOT NULL,
  `requireCyclingrecord` boolean default false NOT NULL,
  `updateCyclingrecord` boolean default false NOT NULL,
  `requireDealrecord` boolean default false NOT NULL,
  `updateDealrecord` boolean default false NOT NULL,
  PRIMARY KEY (`adminRoleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of adminRole
-- ----------------------------
insert into adminRole values(null, true, true, true, true, true, true, true, true, true, true, true, true, true, true);
insert into adminRole values(null, true, false, true, false, true, false, true, false, true, false, true, false, true, false);
insert into adminRole values(null, false, false, false, false, false, false, false, false, false, false, false, false, false, false);

-- ----------------------------
-- Table structure for `user`
-- userName 登录账户
-- name 用户姓名
-- cardNumber 持有卡卡号
-- score 积分，主要培养老客户
-- phone 14个字符主要是指+86之类的
-- status 冻结项，0为冻结，留作挂失、恶意惩罚等
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `userId` int(8) unsigned NOT NULL AUTO_INCREMENT,
  `userName` varchar(18) NOT NULL,
  `password` varchar(20) NOT NULL,
  `name` varchar(16) NOT NULL,
  `cardNumber` char(15) NOT NULL,
  `score` int(11) NOT NULL DEFAULT '1',
  `phone` char(14) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `balance` decimal(8,2) unsigned zerofill NOT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `userName` (`userName`),
  UNIQUE KEY `cardNumber` (`cardNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
insert into user values(null, 'user', '888888', '骑行用户', '1', 1, '111', '1', 20);

-- ----------------------------
-- Table structure for `activity`
-- userId 创建者
-- status -1代表未被阅读（负数代表未被阅读，正数代表以被阅读）
--        1代表已被阅读但未回复
--        2代表已被阅读并已准许
-- 		  3代表已被阅读并已回绝
----------------------------
DROP TABLE IF EXISTS `activity`;
CREATE TABLE `activity` (
  `activityId` int(10) NOT NULL AUTO_INCREMENT,
  `userId` int(8) unsigned NOT NULL,
  `title` varchar(20) NOT NULL,
  `createTime` datetime NOT NULL,
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL,
  `description` varchar(200) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `replyContent` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`activityId`),
  KEY `userId` (`userId`),
  CONSTRAINT `activity_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of activity
-- ----------------------------

-- ----------------------------
-- Table structure for `admin`
-- adminId 默认最高位为1
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `adminId` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `userName` varchar(18) NOT NULL,
  `password` varchar(20) NOT NULL,
  `name` varchar(16) NOT NULL,
  `adminRoleId` int(2) DEFAULT NULL,
  PRIMARY KEY (`adminId`),
  UNIQUE KEY `userName` (`userName`),
  KEY `adminRoleId` (`adminRoleId`),
  CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`adminRoleId`) REFERENCES `adminRole` (`adminRoleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of admin
-- ----------------------------
insert into admin values(null, 'admin', '888888', '超级管理员', 1);
insert into admin values(null, 'admin2', '888888', '普通管理员', 2);

-- ----------------------------
-- Table structure for `advise`
-- status 0代表未被阅读
--        1代表已被阅读但未回复
--        2代表已被阅读并已回复
-- ----------------------------
DROP TABLE IF EXISTS `advise`;
CREATE TABLE `advise` (
  `adviseId` int(8) unsigned NOT NULL AUTO_INCREMENT,
  `adminId` int(8) unsigned DEFAULT NULL,
  `creator` int(8) unsigned NOT NULL,
  `title` varchar(80) NOT NULL,
  `content` varchar(500) NOT NULL,
  `createTime` datetime NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `replyContent` varchar(500) DEFAULT NULL,
  `replyTime` datetime DEFAULT NULL,
  PRIMARY KEY (`adviseId`),
  KEY `adminId` (`adminId`),
  KEY `creator` (`creator`),
  CONSTRAINT `advise_ibfk_2` FOREIGN KEY (`creator`) REFERENCES `user` (`userId`),
  CONSTRAINT `advise_ibfk_1` FOREIGN KEY (`adminId`) REFERENCES `admin` (`adminId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of advise
-- ----------------------------

-- ----------------------------
-- Table structure for `bicycle`
-- from 默认为0即公司采购，否则即为用户编号
-- photoUrl 图片在服务器的路径
-- locationX locationY 自行车最后位置
-- status 0为停止使用，1为正在使用
-- ----------------------------
DROP TABLE IF EXISTS `bicycle`;
CREATE TABLE `bicycle` (
  `bicycleId` int(8) unsigned NOT NULL AUTO_INCREMENT,
  `from` int(8) NOT NULL DEFAULT '0',
  `time` datetime NOT NULL,
  `photoUrl` varchar(200) NOT NULL,
  `lockId` int(15) NOT NULL,
  `locationX` decimal(9,6) DEFAULT NULL,
  `locationY` decimal(9,6) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `energy` float NOT NULL,
  PRIMARY KEY (`bicycleId`),
  UNIQUE KEY `lockId` (`lockId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of bicycle
-- ----------------------------

-- ----------------------------
-- Table structure for `cyclingrecord`
-- cyclingRecordId 拼接主键：userId + (endTime - startTime)
-- startTime 起始时间
-- startLocX startLocY 起始地点
-- ----------------------------
DROP TABLE IF EXISTS `cyclingrecord`;
CREATE TABLE `cyclingrecord` (
  `cyclingRecordId` varchar(22) NOT NULL,
  `bicycleId` int(8) unsigned NOT NULL,
  `userId` int(8) unsigned NOT NULL,
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL,
  `startLocX` decimal(9,6) NOT NULL,
  `startLocY` decimal(9,6) NOT NULL,
  `endLocX` decimal(9,6) NOT NULL,
  `endLocY` decimal(9,6) NOT NULL,
  PRIMARY KEY (`cyclingRecordId`),
  KEY `bicycleId` (`bicycleId`),
  KEY `userId` (`userId`),
  CONSTRAINT `cyclingrecord_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`),
  CONSTRAINT `cyclingrecord_ibfk_1` FOREIGN KEY (`bicycleId`) REFERENCES `bicycle` (`bicycleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cyclingrecord
-- ----------------------------

-- ----------------------------
-- Table structure for `dealrecord`
-- dealRecordId 当作订单号，拼接：userId+actionType+actionTime
-- actionType 交易类型，充值为1，消费为0
-- actionTime 默认为当前时间
-- ----------------------------
DROP TABLE IF EXISTS `dealrecord`;
CREATE TABLE `dealrecord` (
  `dealRecordId` varchar(23) NOT NULL,
  `userId` int(8) unsigned NOT NULL,
  `actionType` tinyint(1) NOT NULL DEFAULT '0',
  `money` decimal(8,2) NOT NULL,
  `actionTime` datetime NOT NULL,
  PRIMARY KEY (`dealRecordId`),
  KEY `userId` (`userId`),
  CONSTRAINT `dealrecord_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dealrecord
-- ----------------------------

