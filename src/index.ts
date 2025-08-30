// ... existing code ...
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 如果是 POST 请求，处理图像生成
    if (request.method === 'POST') {
      try {
        const formData = await request.formData();
        let prompt = formData.get('prompt') as string;
        const style = formData.get('style') as string;

        if (!prompt) {
          return new Response('Missing prompt', { status: 400 });
        }

        // 优化中文提示词 - 添加英文关键词和细节描述
        let enhancedPrompt = prompt;
        if (prompt && !/[a-zA-Z]/.test(prompt)) {
          // 如果提示词主要是中文，添加一些优化策略
          const styleMap: Record<string, string> = {
            'photo': 'photographic, realistic, high quality, detailed, 4k, professional photography',
            'painting': 'painting, artistic, brush strokes, canvas texture, masterpiece, fine art',
            'anime': 'anime style, japanese animation, detailed illustration, character design, vibrant',
            'digital': 'digital art, detailed, vibrant colors, concept art, sharp focus, intricate',
            '3d': '3D render, high detail, cinematic lighting, octane render, blender, volumetric lighting',
            'cyberpunk': 'cyberpunk, neon lights, futuristic, sci-fi, dark atmosphere, high tech',
            'fantasy': 'fantasy, magical, mystical, enchanted, epic, detailed fantasy',
            'realistic': 'realistic, photorealistic, hyperrealistic, ultra detailed, professional photography',
            'vector': 'vector art, clean lines, flat design, svg, simple shapes, minimalistic',
            'pixel': 'pixel art, 8-bit, retro game, low resolution, vintage computer graphics'
          };
          
          if (style && styleMap[style]) {
            enhancedPrompt = `${prompt}, ${styleMap[style]}`;
          } else {
            enhancedPrompt = `${prompt}, high quality, detailed, professional, 4k`;
          }
        }

        const inputs = { prompt: enhancedPrompt };

        const response = await env.AI.run(
          "@cf/stabilityai/stable-diffusion-xl-base-1.0",
          inputs
        );

        return new Response(response, {
          headers: {
            "content-type": "image/png",
          },
        });
      } catch (error) {
        return new Response('Error generating image: ' + error.message, { status: 500 });
      }
    }

    // 默认返回网页界面
    return new Response(
      `
      <!DOCTYPE html>
      <html lang="zh-CN">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>AI 图像生成器</title>
          <style>
            :root {
              --primary-color: #6366f1;
              --primary-hover: #4f46e5;
              --secondary-color: #8b5cf6;
              --background: #f8fafc;
              --card-background: #ffffff;
              --text-primary: #1e293b;
              --text-secondary: #64748b;
              --border: #e2e8f0;
              --shadow: rgba(0, 0, 0, 0.1);
              --success: #10b981;
              --warning: #f59e0b;
              --error: #ef4444;
            }
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              background: linear-gradient(135deg, #f0f4ff 0%, #fdf2ff 100%);
              color: var(--text-primary);
              line-height: 1.6;
              padding: 20px;
              min-height: 100vh;
            }
            
            .container {
              max-width: 900px;
              margin: 0 auto;
            }
            
            header {
              text-align: center;
              margin-bottom: 2rem;
              padding: 1rem 0;
              animation: fadeIn 1s ease-in-out;
            }
            
            h1 {
              font-size: 2.8rem;
              margin-bottom: 0.5rem;
              background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
              font-weight: 800;
            }
            
            .subtitle {
              font-size: 1.2rem;
              color: var(--text-secondary);
              max-width: 600px;
              margin: 0 auto;
            }
            
            .card {
              background: var(--card-background);
              border-radius: 16px;
              box-shadow: 0 10px 25px var(--shadow);
              padding: 2rem;
              margin-bottom: 2rem;
              border: 1px solid var(--border);
              transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .card:hover {
              transform: translateY(-5px);
              box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
            }
            
            .card-title {
              font-size: 1.5rem;
              margin-bottom: 1.2rem;
              color: var(--primary-color);
              display: flex;
              align-items: center;
              gap: 10px;
            }
            
            .card-title i {
              font-size: 1.8rem;
            }
            
            .form-group {
              margin-bottom: 1.5rem;
            }
            
            label {
              display: block;
              margin-bottom: 0.5rem;
              font-weight: 500;
            }
            
            input, textarea, select {
              width: 100%;
              padding: 0.9rem;
              border: 2px solid var(--border);
              border-radius: 10px;
              font-size: 1rem;
              font-family: inherit;
              transition: all 0.3s;
            }
            
            input:focus, textarea:focus, select:focus {
              outline: none;
              border-color: var(--primary-color);
              box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
            }
            
            button {
              background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
              color: white;
              border: none;
              border-radius: 10px;
              padding: 1rem 1.5rem;
              font-size: 1.1rem;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s;
              width: 100%;
              box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
            }
            
            button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
            }
            
            button:disabled {
              background: var(--text-secondary);
              cursor: not-allowed;
              transform: none;
              box-shadow: none;
            }
            
            .image-container {
              text-align: center;
              min-height: 300px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              position: relative;
              border-radius: 10px;
              overflow: hidden;
              background: #f1f5f9;
            }
            
            .image-container img {
              max-width: 100%;
              border-radius: 10px;
              box-shadow: 0 10px 25px var(--shadow);
              max-height: 512px;
              transition: opacity 0.3s;
            }
            
            .placeholder {
              color: var(--text-secondary);
              font-size: 1.1rem;
              padding: 2rem;
              text-align: center;
            }
            
            .loading {
              display: none;
              text-align: center;
            }
            
            .spinner {
              border: 4px solid rgba(255, 255, 255, 0.3);
              border-radius: 50%;
              border-top: 4px solid var(--primary-color);
              width: 40px;
              height: 40px;
              animation: spin 1s linear infinite;
              margin: 0 auto 1rem;
            }
            
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            
            .examples {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
              gap: 1.2rem;
              margin-top: 1rem;
            }
            
            .example {
              background: linear-gradient(135deg, #f0f4ff 0%, #fdf2ff 100%);
              padding: 1rem;
              border-radius: 12px;
              font-size: 0.95rem;
              cursor: pointer;
              transition: all 0.3s;
              border: 1px solid var(--border);
              text-align: center;
            }
            
            .example:hover {
              background: linear-gradient(135deg, #e0e7ff 0%, #f0dfff 100%);
              transform: translateY(-3px);
              box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            }
            
            .tips {
              background: linear-gradient(135deg, #e0f2fe 0%, #dcfce7 100%);
              border-left: 5px solid var(--success);
              padding: 1.2rem;
              border-radius: 0 12px 12px 0;
              margin: 1.5rem 0;
              font-size: 0.95rem;
            }
            
            .tips h3 {
              margin-bottom: 0.7rem;
              color: #0369a1;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            
            .tips ul {
              padding-left: 1.5rem;
            }
            
            .tips li {
              margin-bottom: 0.5rem;
            }
            
            footer {
              text-align: center;
              margin-top: 2rem;
              color: var(--text-secondary);
              font-size: 0.95rem;
              padding: 1.5rem;
            }
            
            .style-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
              gap: 1rem;
              margin-top: 0.5rem;
            }
            
            .style-option {
              padding: 0.8rem;
              border: 2px solid var(--border);
              border-radius: 10px;
              text-align: center;
              cursor: pointer;
              transition: all 0.2s;
              background: #f8fafc;
            }
            
            .style-option:hover {
              border-color: var(--primary-color);
              background: #f0f4ff;
            }
            
            .style-option.selected {
              border-color: var(--primary-color);
              background: #eef2ff;
              font-weight: 600;
              box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
            }
            
            .notification {
              padding: 1rem;
              border-radius: 10px;
              margin: 1rem 0;
              text-align: center;
              display: none;
            }
            
            .notification.error {
              background: #fee2e2;
              color: #991b1b;
              border: 1px solid #fecaca;
              display: block;
            }
            
            .enhanced-prompt {
              background-color: #f0f9ff;
              border: 1px dashed #3b82f6;
              border-radius: 8px;
              padding: 1rem;
              margin-top: 1rem;
              font-size: 0.9rem;
              display: none;
            }
            
            .enhanced-prompt-header {
              font-weight: 600;
              color: #3b82f6;
              margin-bottom: 0.5rem;
              display: flex;
              align-items: center;
              gap: 5px;
            }
            
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            
            .fade-in {
              animation: fadeIn 0.5s ease-out;
            }
            
            .fade-in-up {
              animation: fadeInUp 0.5s ease-out;
            }
            
            @media (max-width: 640px) {
              .container {
                padding: 1rem;
              }
              
              .card {
                padding: 1.5rem;
              }
              
              h1 {
                font-size: 2.2rem;
              }
              
              .style-grid {
                grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <header>
              <h1>🎨 AI 图像生成器</h1>
              <p class="subtitle">将您的文字描述转换为令人惊叹的图像，释放您的创意潜能</p>
            </header>
            
            <main>
              <div class="card fade-in">
                <h2 class="card-title">✨ 创作设置</h2>
                <form id="generate-form">
                  <div class="form-group">
                    <label for="prompt">图像描述</label>
                    <textarea 
                      id="prompt" 
                      name="prompt" 
                      placeholder="例如：一只戴着墨镜的赛博朋克猫，霓虹灯背景，超现实主义风格..." 
                      rows="4"
                      required
                    ></textarea>
                    <div class="enhanced-prompt" id="enhanced-prompt">
                      <div class="enhanced-prompt-header">
                        🤖 AI增强提示词:
                      </div>
                      <div id="enhanced-prompt-text"></div>
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label for="style">艺术风格</label>
                    <div class="style-grid" id="style-grid">
                      <div class="style-option" data-style="">默认</div>
                      <div class="style-option" data-style="photo">照片</div>
                      <div class="style-option" data-style="painting">绘画</div>
                      <div class="style-option" data-style="anime">动漫</div>
                      <div class="style-option" data-style="digital">数字艺术</div>
                      <div class="style-option" data-style="3d">3D渲染</div>
                      <div class="style-option" data-style="cyberpunk">赛博朋克</div>
                      <div class="style-option" data-style="fantasy">奇幻</div>
                      <div class="style-option" data-style="realistic">写实</div>
                      <div class="style-option" data-style="vector">矢量</div>
                      <div class="style-option" data-style="pixel">像素</div>
                    </div>
                    <input type="hidden" id="style" name="style" value="">
                  </div>
                  
                  <div class="tips">
                    <h3>💡 提示词优化建议</h3>
                    <ul>
                      <li><strong>详细描述</strong>：描述越详细，效果越好。例如："一只坐在窗台上的橘色猫咪，阳光洒在毛发上"</li>
                      <li><strong>添加质量词</strong>：如"高清、细节丰富、专业、4K"</li>
                      <li><strong>指定艺术风格</strong>："油画、水彩画、照片写实、动漫"</li>
                      <li><strong>视角和光线</strong>：添加视角和光线描述，如"正面视角、柔和光线"</li>
                      <li><strong>情绪氛围</strong>：添加情绪词，如"温馨、神秘、史诗感"</li>
                    </ul>
                  </div>
                  
                  <div id="notification" class="notification"></div>
                  
                  <button type="submit" id="generate-btn">
                    <span class="button-text">✨ 生成图像</span>
                    <div class="loading" id="loading">
                      <div class="spinner"></div>
                      <span>AI 正在创作中...</span>
                    </div>
                  </button>
                </form>
              </div>
              
              <div class="card fade-in-up">
                <h2 class="card-title">🖼️ 生成结果</h2>
                <div class="image-container" id="image-container">
                  <p class="placeholder">您的生成图像将显示在这里</p>
                  <img id="generated-image" style="display: none;" alt="Generated image">
                </div>
              </div>
              
              <div class="card fade-in-up">
                <h2 class="card-title">🌟 示例作品</h2>
                <div class="examples">
                  <div class="example" data-prompt="一只戴着王冠的可爱猫咪，奇幻风格，金色背景，高清细节，专业摄影">👑 戴王冠的猫咪</div>
                  <div class="example" data-prompt="未来城市中的飞行汽车，赛博朋克风格，霓虹灯，夜景，高清，细节丰富">🚗 未来飞行汽车</div>
                  <div class="example" data-prompt="宁静的山水画，水墨风格，中国传统绘画，高山流水，意境优美">🏞️ 水墨山水画</div>
                  <div class="example" data-prompt="宇航员骑着马在太空，概念艺术，科幻风格，高清细节，壮丽的宇宙背景">👨‍🚀 太空中的宇航员</div>
                  <div class="example" data-prompt="一只戴着耳机的狐狸，在咖啡厅里喝咖啡，都市风格，温暖的灯光，细节丰富">🦊 戴耳机的狐狸</div>
                  <div class="example" data-prompt="机械朋克风格的机器人花朵，金属质感，精细的机械结构，蒸汽朋克，高清">🤖 机器人花朵</div>
                </div>
              </div>
            </main>
            
            <footer>
              <p>使用 Cloudflare AI 技术驱动 | 为您创造无限可能</p>
            </footer>
          </div>
          
          <script>
            document.addEventListener('DOMContentLoaded', function() {
              const form = document.getElementById('generate-form');
              const imageContainer = document.getElementById('image-container');
              const generatedImage = document.getElementById('generated-image');
              const placeholder = document.querySelector('.placeholder');
              const generateBtn = document.getElementById('generate-btn');
              const buttonText = document.querySelector('.button-text');
              const loadingText = document.getElementById('loading');
              const examples = document.querySelectorAll('.example');
              const styleOptions = document.querySelectorAll('.style-option');
              const styleInput = document.getElementById('style');
              const notification = document.getElementById('notification');
              const promptInput = document.getElementById('prompt');
              const enhancedPromptContainer = document.getElementById('enhanced-prompt');
              const enhancedPromptText = document.getElementById('enhanced-prompt-text');
              
              // 风格映射（用于显示增强提示词）
              const styleMap = {
                '': 'high quality, detailed, professional, 4k',
                'photo': 'photographic, realistic, high quality, detailed, 4k, professional photography',
                'painting': 'painting, artistic, brush strokes, canvas texture, masterpiece, fine art',
                'anime': 'anime style, japanese animation, detailed illustration, character design, vibrant',
                'digital': 'digital art, detailed, vibrant colors, concept art, sharp focus, intricate',
                '3d': '3D render, high detail, cinematic lighting, octane render, blender, volumetric lighting',
                'cyberpunk': 'cyberpunk, neon lights, futuristic, sci-fi, dark atmosphere, high tech',
                'fantasy': 'fantasy, magical, mystical, enchanted, epic, detailed fantasy',
                'realistic': 'realistic, photorealistic, hyperrealistic, ultra detailed, professional photography',
                'vector': 'vector art, clean lines, flat design, svg, simple shapes, minimalistic',
                'pixel': 'pixel art, 8-bit, retro game, low resolution, vintage computer graphics'
              };
              
              // 处理风格选择
              styleOptions.forEach(option => {
                option.addEventListener('click', function() {
                  // 移除所有选项的选中状态
                  styleOptions.forEach(opt => opt.classList.remove('selected'));
                  
                  // 添加当前选中状态
                  this.classList.add('selected');
                  
                  // 设置隐藏输入框的值
                  styleInput.value = this.getAttribute('data-style');
                  
                  // 更新增强提示词显示
                  updateEnhancedPrompt();
                });
              });
              
              // 监听提示词输入变化
              promptInput.addEventListener('input', updateEnhancedPrompt);
              
              // 更新增强提示词显示
              function updateEnhancedPrompt() {
                const prompt = promptInput.value.trim();
                const style = styleInput.value || '';
                
                if (prompt && !/[a-zA-Z]/.test(prompt)) {
                  const enhancedText = prompt + ', ' + styleMap[style];
                  enhancedPromptText.textContent = enhancedText;
                  enhancedPromptContainer.style.display = 'block';
                } else if (prompt) {
                  // 如果包含英文，则不显示增强提示词
                  enhancedPromptContainer.style.display = 'none';
                } else {
                  // 如果没有输入，则隐藏
                  enhancedPromptContainer.style.display = 'none';
                }
              }
              
              // 处理表单提交
              form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const prompt = promptInput.value.trim();
                if (!prompt) {
                  showNotification('请输入图像描述', 'error');
                  return;
                }
                
                // 显示加载状态
                generateBtn.disabled = true;
                buttonText.style.display = 'none';
                loadingText.style.display = 'block';
                notification.style.display = 'none';
                
                try {
                  const formData = new FormData();
                  formData.append('prompt', prompt);
                  formData.append('style', styleInput.value);
                  
                  const response = await fetch('/', {
                    method: 'POST',
                    body: formData
                  });
                  
                  if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || '图像生成失败');
                  }
                  
                  const blob = await response.blob();
                  const imageUrl = URL.createObjectURL(blob);
                  
                  // 显示生成的图像
                  generatedImage.src = imageUrl;
                  generatedImage.style.display = 'block';
                  placeholder.style.display = 'none';
                } catch (error) {
                  showNotification('生成图像时出错: ' + error.message, 'error');
                } finally {
                  // 恢复按钮状态
                  generateBtn.disabled = false;
                  buttonText.style.display = 'inline';
                  loadingText.style.display = 'none';
                }
              });
              
              // 处理示例点击
              examples.forEach(example => {
                example.addEventListener('click', function() {
                  const prompt = this.getAttribute('data-prompt');
                  promptInput.value = prompt;
                  
                  // 更新增强提示词显示
                  updateEnhancedPrompt();
                  
                  // 滚动到表单顶部
                  document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });
                });
              });
              
              // 显示通知
              function showNotification(message, type) {
                notification.textContent = message;
                notification.className = 'notification ' + type;
                notification.style.display = 'block';
                
                // 3秒后自动隐藏
                setTimeout(() => {
                  notification.style.display = 'none';
                }, 3000);
              }
            });
          </script>
        </body>
      </html>
      `,
      {
        headers: {
          "content-type": "text/html;charset=UTF-8",
        },
      }
    );
  },
} satisfies ExportedHandler<Env>;
// ... existing code ...