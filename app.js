(function(){
  // ── GAS Web App URL（デプロイ後にここを差し替えてください） ──
  var GAS_URL="https://script.google.com/macros/s/AKfycbw1SP3eGCsvkKYxK7oTVdFR7pewjIee1hLMcF3M3goxAqKoobvlT93PeK81dLC5th3YSQ/exec";

  // ── 日英メッセージ辞書 ──
  var MESSAGES={
    ja:{
      validationError:"入力内容を確認してください。",
      sending:"送信中...",
      success:"送信しました。ありがとうございます。",
      error:"送信できませんでした。時間を置いて再度お試しください。",
      submit:"送信する"
    },
    en:{
      validationError:"Please check your input.",
      sending:"Sending...",
      success:"Your message has been sent. Thank you.",
      error:"Failed to send. Please try again later.",
      submit:"Send"
    }
  };

  document.addEventListener("DOMContentLoaded",function(){
    // ── 言語判定 ──
    var lang=document.documentElement.lang==="ja"?"ja":"en";
    var msg=MESSAGES[lang];

    var btn=document.querySelector("[data-toggle]");
    var nav=document.getElementById("pe-nav");
    if(btn&&nav){
      btn.addEventListener("click",function(){
        var open=btn.getAttribute("aria-expanded")==="true";
        btn.setAttribute("aria-expanded",String(!open));
        nav.classList.toggle("is-open");
      });
    }

    var box=document.querySelector(".js-status");

    // ── コンタクトフォーム送信 ──
    var form=document.getElementById("contact-form");
    if(form&&box){
      form.addEventListener("submit",function(e){
        e.preventDefault();

        // ハニーポットチェック
        var hp=form.querySelector("[name=url]");
        if(hp&&hp.value){return;}

        var name=form.querySelector("[name=name]").value.trim();
        var email=form.querySelector("[name=email]").value.trim();
        var message=form.querySelector("[name=message]").value.trim();

        // 簡易バリデーション
        if(!name||name.length>80||!email||!message||message.length>2000){
          box.textContent=msg.validationError;
          box.className="pe-status js-status pe-status--ng is-show";
          return;
        }

        var submitBtn=form.querySelector(".pe-submit");
        submitBtn.disabled=true;
        submitBtn.textContent=msg.sending;

        fetch(GAS_URL,{
          method:"POST",
          headers:{"Content-Type":"text/plain"},
          body:JSON.stringify({name:name,email:email,message:message,lang:lang})
        })
        .then(function(res){return res.json();})
        .then(function(data){
          if(data.status==="success"){
            box.textContent=msg.success;
            box.className="pe-status js-status pe-status--ok is-show";
            form.reset();
          }else{
            box.textContent=msg.error;
            box.className="pe-status js-status pe-status--ng is-show";
          }
        })
        .catch(function(){
          box.textContent=msg.error;
          box.className="pe-status js-status pe-status--ng is-show";
        })
        .finally(function(){
          submitBtn.disabled=false;
          submitBtn.textContent=msg.submit;
        });
      });
    }
  });
})();
