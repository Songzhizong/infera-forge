# GitHub Pages 部署指南

本项目已配置为自动部署到 GitHub Pages。

## 如何启用部署

1. **在 GitHub 仓库中配置 Pages 设置**
   - 访问仓库页面：https://github.com/Songzhizong/infera-forge
   - 进入 `Settings` > `Pages`
   - 在 `Source` 部分，选择 `GitHub Actions`

2. **触发部署**
   - 将此 PR 合并到 `main` 分支
   - GitHub Actions 会自动运行工作流并部署网站
   - 或者，在 `Actions` 标签页中手动触发 `Deploy to GitHub Pages` 工作流

3. **访问部署的网站**
   - 部署完成后，网站将可在以下地址访问：
   - https://songzhizong.github.io/infera-forge/

## 工作原理

### 1. Vite 配置
- `vite.config.ts` 中配置了生产环境的 `base` 路径为 `/infera-forge/`
- 这确保了所有资源（JS、CSS、图片）使用正确的路径

### 2. GitHub Actions 工作流
- `.github/workflows/deploy.yml` 定义了自动化部署流程
- 工作流在推送到 `main` 分支时自动运行
- 工作流步骤：
  1. 检出代码
  2. 安装 Node.js 和依赖
  3. 构建项目（`npm run build`）
  4. 上传构建产物到 GitHub Pages
  5. 部署到 GitHub Pages

### 3. 客户端路由支持
- `public/404.html` 和 `index.html` 中添加了重定向脚本
- 这解决了 React Router 在 GitHub Pages 上的刷新问题
- 当用户直接访问子路由时，GitHub Pages 会返回 404.html
- 404.html 将 URL 转换为查询参数并重定向到 index.html
- index.html 接收查询参数并恢复正确的路由路径

## 本地测试

要在本地测试生产构建：

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

注意：本地预览时 `base` 路径设置为 `/`，所以可以在 http://localhost:4173 直接访问。

## 故障排除

### 资源加载失败（404）
- 确保 `vite.config.ts` 中的 `base` 配置正确
- 应该是 `/infera-forge/`（仓库名称）

### 路由刷新后 404
- 确保 `public/404.html` 和 `index.html` 中的重定向脚本完整
- 确保 404.html 被正确复制到构建输出目录

### 部署失败
- 检查 GitHub Actions 日志
- 确保在 GitHub 仓库设置中启用了 GitHub Pages
- 确保选择了 `GitHub Actions` 作为部署源

## 更新部署

每次推送到 `main` 分支时，GitHub Actions 会自动：
1. 构建最新的代码
2. 部署到 GitHub Pages
3. 通常在几分钟内完成

## 自定义域名（可选）

如果要使用自定义域名：
1. 在 `public` 目录添加 `CNAME` 文件，内容为你的域名
2. 在域名提供商处配置 DNS 记录
3. 在 GitHub 仓库设置的 Pages 部分配置自定义域名

更多信息：https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
