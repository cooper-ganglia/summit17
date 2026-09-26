type GalleryItem = { src: string; depth: string; alt: string; width: number; height: number };

function makeRenderer(canvas: HTMLCanvasElement, stage: HTMLElement) {
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' });
  if (!gl) return null;
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || 'Shader error');
    return shader;
  };
  const vertex = compile(gl.VERTEX_SHADER, `
    attribute vec2 aPosition;
    varying vec2 vUv;
    void main() { vUv = (aPosition + 1.0) * 0.5; gl_Position = vec4(aPosition, 0.0, 1.0); }
  `);
  const fragment = compile(gl.FRAGMENT_SHADER, `
    precision highp float;
    uniform sampler2D uPhoto;
    uniform sampler2D uDepth;
    uniform vec2 uMotion;
    varying vec2 vUv;
    void main() {
      float depth = texture2D(uDepth, vUv).r;
      vec2 sampleUv = clamp(vUv - uMotion * (depth - 0.35) * 0.004, vec2(0.001), vec2(0.999));
      gl_FragColor = texture2D(uPhoto, sampleUv);
    }
  `);
  const program = gl.createProgram()!;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'Program error');
  gl.useProgram(program);
  const vertices = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertices);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,-1, 1,1, -1,1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  const textures = [gl.createTexture(), gl.createTexture()];
  textures.forEach((texture, unit) => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  });
  gl.uniform1i(gl.getUniformLocation(program, 'uPhoto'), 0);
  gl.uniform1i(gl.getUniformLocation(program, 'uDepth'), 1);
  const motionLocation = gl.getUniformLocation(program, 'uMotion');
  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.max(1, Math.round(stage.clientWidth * ratio));
    canvas.height = Math.max(1, Math.round(stage.clientHeight * ratio));
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  return {
    setImages(photo: HTMLImageElement, depth: HTMLImageElement) {
      [photo, depth].forEach((image, unit) => {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, textures[unit]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      });
    },
    resize,
    draw(x: number, y: number) { gl.uniform2f(motionLocation, x, -y); gl.drawArrays(gl.TRIANGLES, 0, 6); }
  };
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load ${url}`));
    image.src = url;
  });
}

document.querySelectorAll<HTMLElement>('[data-gallery]').forEach((gallery) => {
  const items: GalleryItem[] = JSON.parse(gallery.dataset.items || '[]');
  const dialog = gallery.querySelector<HTMLDialogElement>('[data-lightbox]')!;
  const image = dialog.querySelector<HTMLImageElement>('[data-lightbox-image]')!;
  const caption = dialog.querySelector<HTMLElement>('[data-caption]')!;
  const stage = dialog.querySelector<HTMLElement>('[data-stage]')!;
  const canvas = dialog.querySelector<HTMLCanvasElement>('[data-depth-canvas]')!;
  const toggle = dialog.querySelector<HTMLButtonElement>('[data-depth-toggle]')!;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let depthEnabled = false;
  let renderer: ReturnType<typeof makeRenderer> = null;
  let targetX = 0, targetY = 0, currentX = 0, currentY = 0, frame = 0;

  const schedule = () => { if (!frame && renderer && depthEnabled) frame = requestAnimationFrame(tick); };
  const tick = () => {
    frame = 0;
    if (!renderer || !depthEnabled) return;
    currentX += (targetX - currentX) * .18;
    currentY += (targetY - currentY) * .18;
    renderer.draw(currentX, currentY);
    if (Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > .003) schedule();
  };
  const updateToggle = () => {
    toggle.setAttribute('aria-pressed', String(depthEnabled));
    toggle.textContent = `Depth motion: ${depthEnabled ? 'on' : 'off'}`;
  };
  const loadDepth = async (index: number) => {
    canvas.classList.remove('active');
    try {
      const [photo, depth] = await Promise.all([loadImage(items[index].src), loadImage(items[index].depth)]);
      if (!depthEnabled || active !== index || !dialog.open || reducedMotion.matches) return;
      renderer ||= makeRenderer(canvas, stage);
      if (!renderer) throw new Error('WebGL unavailable');
      renderer.setImages(photo, depth);
      renderer.resize();
      renderer.draw(currentX, currentY);
      canvas.classList.add('active');
      schedule();
    } catch {
      depthEnabled = false;
      updateToggle();
      canvas.classList.remove('active');
    }
  };
  const show = (index: number) => {
    active = (index + items.length) % items.length;
    const item = items[active];
    image.src = item.src;
    image.alt = item.alt;
    stage.style.setProperty('--image-ratio', String(item.width / item.height));
    caption.textContent = `${String(active + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')} — ${item.alt}`;
    targetX = targetY = currentX = currentY = 0;
    canvas.classList.remove('active');
    if (depthEnabled) void loadDepth(active);
  };
  gallery.querySelectorAll<HTMLButtonElement>('[data-photo]').forEach((button) => button.addEventListener('click', () => {
    dialog.showModal();
    show(Number(button.dataset.photo));
  }));
  dialog.querySelector('[data-close]')?.addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-prev]')?.addEventListener('click', () => show(active - 1));
  dialog.querySelector('[data-next]')?.addEventListener('click', () => show(active + 1));
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(active - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); show(active + 1); }
  });
  toggle.addEventListener('click', () => {
    if (reducedMotion.matches) return;
    depthEnabled = !depthEnabled;
    updateToggle();
    canvas.classList.remove('active');
    if (depthEnabled) void loadDepth(active);
  });
  stage.addEventListener('pointermove', (event) => {
    if (!depthEnabled || reducedMotion.matches || (event.pointerType !== 'mouse' && event.pointerType !== 'pen')) return;
    const rect = stage.getBoundingClientRect();
    targetX = ((event.clientX - rect.left) / rect.width - .5) * 2;
    targetY = ((event.clientY - rect.top) / rect.height - .5) * 2;
    schedule();
  });
  stage.addEventListener('pointerleave', () => { targetX = targetY = 0; schedule(); });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) { depthEnabled = false; updateToggle(); canvas.classList.remove('active'); }
  });
  window.addEventListener('resize', () => { if (canvas.classList.contains('active')) { renderer?.resize(); renderer?.draw(currentX, currentY); } });
  canvas.addEventListener('webglcontextlost', () => { canvas.classList.remove('active'); depthEnabled = false; updateToggle(); });
});
