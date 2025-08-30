export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 如果是 POST 请求，处理图像生成
    if (request.method === 'POST') {
      try {
        const formData = await request.formData();
        const prompt = formData.get('prompt') as string;

        if (!prompt) {
          return new Response('Missing prompt', { status: 400 });
        }

        const inputs = { prompt };

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
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Text to Image Generator</title>
          <style>
            :root {
              --primary-color: #6366f1;
              --primary-hover: #4f46e5;
              --background: #f8fafc;
              --card-background: #ffffff;
              --text-primary: #1e293b;
              --text-secondary: #64748b;
              --border: #e2e8f0;
              --shadow: rgba(0, 0, 0, 0.1);
            }
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              background-color: var(--background);
              color: var(--text-primary);
              line-height: 1.6;
              padding: 20px;
              min-height: 100vh;
            }
            
            .container {
              max-width: 800px;
              margin: 0 auto;
            }
            
            header {
              text-align: center;
              margin-bottom: 2rem;
              padding: 1rem 0;
            }
            
            h1 {
              font-size: 2.5rem;
              margin-bottom: 0.5rem;
              background: linear-gradient(90deg, var(--primary-color), #8b5cf6);
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
            }
            
            .subtitle {
              font-size: 1.1rem;
              color: var(--text-secondary);
            }
            
            .card {
              background: var(--card-background);
              border-radius: 12px;
              box-shadow: 0 4px 6px var(--shadow);
              padding: 2rem;
              margin-bottom: 2rem;
              border: 1px solid var(--border);
            }
            
            .form-group {
              margin-bottom: 1.5rem;
            }
            
            label {
              display: block;
              margin-bottom: 0.5rem;
              font-weight: 500;
            }
            
            input, textarea {
              width: 100%;
              padding: 0.75rem;
              border: 1px solid var(--border);
              border-radius: 8px;
              font-size: 1rem;
              font-family: inherit;
              transition: border-color 0.2s;
            }
            
            input:focus, textarea:focus {
              outline: none;
              border-color: var(--primary-color);
              box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
            }
            
            button {
              background-color: var(--primary-color);
              color: white;
              border: none;
              border-radius: 8px;
              padding: 0.75rem 1.5rem;
              font-size: 1rem;
              font-weight: 500;
              cursor: pointer;
              transition: background-color 0.2s;
              width: 100%;
            }
            
            button:hover {
              background-color: var(--primary-hover);
            }
            
            button:disabled {
              background-color: var(--text-secondary);
              cursor: not-allowed;
            }
            
            .image-container {
              text-align: center;
              min-height: 300px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }
            
            .image-container img {
              max-width: 100%;
              border-radius: 8px;
              box-shadow: 0 4px 12px var(--shadow);
              max-height: 512px;
            }
            
            .placeholder {
              color: var(--text-secondary);
              font-size: 1rem;
            }
            
            .loading {
              display: none;
            }
            
            .examples {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
              gap: 1rem;
              margin-top: 1rem;
            }
            
            .example {
              background: var(--background);
              padding: 0.75rem;
              border-radius: 8px;
              font-size: 0.9rem;
              cursor: pointer;
              transition: all 0.2s;
              border: 1px solid var(--border);
            }
            
            .example:hover {
              background: #f1f5f9;
              transform: translateY(-2px);
            }
            
            footer {
              text-align: center;
              margin-top: 2rem;
              color: var(--text-secondary);
              font-size: 0.9rem;
            }
            
            @media (max-width: 640px) {
              .container {
                padding: 1rem;
              }
              
              .card {
                padding: 1.5rem;
              }
              
              h1 {
                font-size: 2rem;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <header>
              <h1>AI 图像生成器</h1>
              <p class="subtitle">将您的文字描述转换为令人惊叹的图像</p>
            </header>
            
            <main>
              <div class="card">
                <form id="generate-form">
                  <div class="form-group">
                    <label for="prompt">输入您的描述</label>
                    <textarea 
                      id="prompt" 
                      name="prompt" 
                      placeholder="例如：一只戴着墨镜的赛博朋克猫，霓虹灯背景，超现实主义风格..." 
                      rows="3"
                      required
                    ></textarea>
                  </div>
                  
                  <button type="submit" id="generate-btn">
                    <span class="button-text">生成图像</span>
                    <span class="loading" id="loading">生成中...</span>
                  </button>
                </form>
              </div>
              
              <div class="card">
                <h2>生成的图像</h2>
                <div class="image-container" id="image-container">
                  <p class="placeholder">您的生成图像将显示在这里</p>
                  <img id="generated-image" style="display: none;" alt="Generated image">
                </div>
              </div>
              
              <div class="card">
                <h2>示例描述</h2>
                <div class="examples">
                  <div class="example" data-prompt="一只戴着王冠的可爱猫咪，奇幻风格，金色背景">戴着王冠的猫咪</div>
                  <div class="example" data-prompt="未来城市中的飞行汽车，赛博朋克风格，霓虹灯">未来飞行汽车</div>
                  <div class="example" data-prompt="宁静的山水画，水墨风格">水墨山水画</div>
                  <div class="example" data-prompt="宇航员骑着马在太空，概念艺术">太空中的宇航员</div>
                </div>
              </div>
            </main>
            
            <footer>
              <p>使用 Cloudflare AI 技术驱动</p>
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
              
              // 处理表单提交
              form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const prompt = document.getElementById('prompt').value.trim();
                if (!prompt) return;
                
                // 显示加载状态
                generateBtn.disabled = true;
                buttonText.style.display = 'none';
                loadingText.style.display = 'inline';
                
                try {
                  const formData = new FormData();
                  formData.append('prompt', prompt);
                  
                  const response = await fetch('/', {
                    method: 'POST',
                    body: formData
                  });
                  
                  if (!response.ok) {
                    throw new Error('图像生成失败');
                  }
                  
                  const blob = await response.blob();
                  const imageUrl = URL.createObjectURL(blob);
                  
                  // 显示生成的图像
                  generatedImage.src = imageUrl;
                  generatedImage.style.display = 'block';
                  placeholder.style.display = 'none';
                } catch (error) {
                  alert('生成图像时出错: ' + error.message);
                  placeholder.textContent = '生成图像时出错，请重试';
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
                  document.getElementById('prompt').value = prompt;
                });
              });
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