const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const input = $("#input");
const messages = $("#messages");
const welcome = $("#welcome");
const sendBtn = $("#sendBtn");
const toast = $("#toast");
const sidebar = $("#sidebar");
const overlay = $("#mobileOverlay");

let mode = localStorage.getItem("alqrbah-mode") || "المحادثة";
let theme = localStorage.getItem("alqrbah-theme") || "inferno";

document.body.dataset.theme = theme;
$("#themeSelect").value = theme;
$("#modeLabel").textContent = mode;

function showToast(text){
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(showToast.t);
  showToast.t = setTimeout(()=>toast.classList.remove("show"),2200);
}

function autoResize(){
  input.style.height = "auto";
  input.style.height = Math.min(input.scrollHeight,190) + "px";
}
input.addEventListener("input", autoResize);

function addMessage(text, type="ai"){
  welcome.style.display = "none";
  const row = document.createElement("div");
  row.className = `message ${type}`;
  const avatar = document.createElement("div");
  avatar.className = "msg-avatar";
  avatar.textContent = type === "user" ? "👤" : "🦂";
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;
  row.append(avatar,bubble);
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
}

function addTyping(){
  const row = document.createElement("div");
  row.className = "message ai";
  row.id = "typing";
  const avatar = document.createElement("div");
  avatar.className = "msg-avatar";
  avatar.textContent = "🦂";
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>';
  row.append(avatar,bubble);
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
}

function sendMessage(){
  const text = input.value.trim();
  if(!text) return;
  addMessage(text,"user");
  input.value = "";
  autoResize();
  sendBtn.disabled = true;
  addTyping();

  setTimeout(()=>{
    $("#typing")?.remove();
    addMessage("تم استلام رسالتك 🦂\n\nواجهة التشات أصبحت جاهزة. في المرحلة التالية سنربطها بنموذج ذكاء اصطناعي حقيقي عبر Backend آمن، بدون وضع مفتاح API داخل الموقع.");
    sendBtn.disabled = false;
  },700);
}

sendBtn.addEventListener("click",sendMessage);
input.addEventListener("keydown",(e)=>{
  if(e.key === "Enter" && !e.shiftKey){
    e.preventDefault();
    sendMessage();
  }
});

$$(".quick-card").forEach(btn=>{
  btn.addEventListener("click",()=>{
    input.value = btn.dataset.prompt || "";
    autoResize();
    input.focus();
  });
});

$("#newChat").addEventListener("click",()=>{
  messages.innerHTML = "";
  welcome.style.display = "";
  input.value = "";
  autoResize();
  $$(".history-item").forEach(x=>x.classList.remove("active"));
  $(".history-item")?.classList.add("active");
  closeMobile();
  showToast("بدأت محادثة جديدة 🦂");
});

function closeMobile(){
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
}
$("#menuBtn").addEventListener("click",()=>{
  sidebar.classList.add("open");
  overlay.classList.add("show");
});
overlay.addEventListener("click",closeMobile);

function openSettings(){ $("#settingsModal").hidden = false; }
function closeSettings(){ $("#settingsModal").hidden = true; }
$("#settingsBtn").addEventListener("click",openSettings);
$("#settingsTopBtn").addEventListener("click",openSettings);
$("#accountBtn").addEventListener("click",openSettings);
$("#closeSettings").addEventListener("click",closeSettings);
$("#closeSettings2").addEventListener("click",closeSettings);
$("#settingsModal").addEventListener("click",(e)=>{if(e.target.id==="settingsModal") closeSettings()});

$("#themeSelect").addEventListener("change",(e)=>{
  theme = e.target.value;
  document.body.dataset.theme = theme;
  localStorage.setItem("alqrbah-theme",theme);
  showToast("تم تغيير الثيم ✨");
});
$("#motionToggle").addEventListener("change",(e)=>{
  document.body.classList.toggle("no-motion",!e.target.checked);
  localStorage.setItem("alqrbah-motion",e.target.checked ? "on":"off");
});
const savedMotion = localStorage.getItem("alqrbah-motion");
if(savedMotion==="off"){ $("#motionToggle").checked=false; document.body.classList.add("no-motion"); }

$("#resetSettings").addEventListener("click",()=>{
  theme="inferno";
  document.body.dataset.theme=theme;
  $("#themeSelect").value=theme;
  $("#motionToggle").checked=true;
  document.body.classList.remove("no-motion");
  localStorage.removeItem("alqrbah-theme");
  localStorage.removeItem("alqrbah-motion");
  showToast("رجعت الإعدادات للوضع الأساسي");
});

$("#toolsBtn").addEventListener("click",()=>{
  const p=$("#toolsPopover");
  p.hidden=!p.hidden;
});
$$("#toolsPopover button").forEach(btn=>{
  btn.addEventListener("click",()=>{
    mode=btn.dataset.mode;
    $("#modeLabel").textContent=mode;
    localStorage.setItem("alqrbah-mode",mode);
    $("#toolsPopover").hidden=true;
    showToast(`الوضع: ${mode}`);
  });
});
document.addEventListener("click",(e)=>{
  if(!e.target.closest("#toolsBtn") && !e.target.closest("#toolsPopover")) $("#toolsPopover").hidden=true;
});

$("#attachBtn").addEventListener("click",()=>$("#fileInput").click());
$("#fileInput").addEventListener("change",(e)=>{
  const count=e.target.files.length;
  if(count) showToast(`تم اختيار ${count} ملف — الربط الحقيقي للملفات بالمرحلة القادمة 📁`);
  e.target.value="";
});
$("#webBtn").addEventListener("click",()=>{
  mode="البحث";
  $("#modeLabel").textContent=mode;
  localStorage.setItem("alqrbah-mode",mode);
  showToast("تم تفعيل وضع البحث 🌐 — الربط الحقيقي لاحقًا");
});
$("#searchBtn").addEventListener("click",()=>{
  input.focus();
  showToast("اكتب كلمات البحث داخل المحادثة");
});

$$(".nav-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    $$(".nav-btn").forEach(x=>x.classList.remove("active"));
    btn.classList.add("active");
    const view=btn.dataset.view;
    if(view!=="chat"){
      showToast(`${btn.textContent.trim()} — الواجهة قيد التجهيز`);
    }
    closeMobile();
  });
});

$$(".history-item").forEach(btn=>{
  btn.addEventListener("click",()=>{
    $$(".history-item").forEach(x=>x.classList.remove("active"));
    btn.classList.add("active");
    showToast("المحادثة محفوظة كواجهة تجريبية حاليًا");
    closeMobile();
  });
});

autoResize();
