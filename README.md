# 岳宝宝专属健康体温监控

这是一个用于记录和监控宝宝体温的Web应用。

## 功能特点

- 记录宝宝体温和用药情况
- 可视化体温变化趋势
- 数据本地存储
- 响应式设计，支持手机访问

## 部署到GitHub Pages的详细步骤

### 1. 注册GitHub账号
- 访问 [GitHub官网](https://github.com)
- 点击右上角的"Sign up"按钮
- 按照提示填写用户名、邮箱和密码
- 完成邮箱验证

### 2. 创建新仓库
- 登录GitHub账号
- 点击右上角的"+"图标，选择"New repository"
- 填写仓库名称（建议使用：baby-temperature）
- 选择"Public"（公开仓库）
- 不要勾选"Initialize this repository with a README"
- 点击"Create repository"完成创建

### 3. 安装Git工具
- Windows用户：
  - 访问 https://git-scm.com/download/win 下载Git安装包
  - 运行安装包，使用默认选项完成安装
- Mac用户：
  - 打开终端
  - 输入 `git --version`，如果未安装会自动提示安装

### 4. 上传代码到GitHub
1. 打开终端（Windows用户打开Git Bash）
2. 进入项目文件夹：
   ```bash
   cd 项目文件夹路径
   ```
3. 初始化Git仓库并上传代码：
   ```bash
   git init
   git add .
   git commit -m "初始提交"
   git branch -M main
   git remote add origin https://github.com/你的用户名/仓库名.git
   git push -u origin main
   ```
   注意：将"你的用户名"和"仓库名"替换为实际的值

### 5. 启用GitHub Pages
1. 打开你的GitHub仓库页面
2. 点击顶部的"Settings"（设置）标签
3. 在左侧菜单中找到并点击"Pages"
4. 在"Source"部分：
   - 选择"Deploy from a branch"
   - 在Branch下拉菜单中选择"main"
   - 点击"Save"保存设置

### 6. 访问网站
- 等待几分钟让GitHub完成部署
- 访问 https://你的用户名.github.io/仓库名/ 查看网站
- 如果网站没有立即显示，请等待几分钟后刷新

## 本地开发

直接在浏览器中打开index.html文件即可运行应用。

## 注意事项

- 确保所有文件（index.html, script.js, styles.css）都已正确上传
- 部署过程可能需要等待1-5分钟
- 如果遇到问题，检查仓库设置和文件路径是否正确