(function(){
  // ── GAS Web App URL ──
  var GAS_URL="https://script.google.com/macros/s/AKfycbw1SP3eGCsvkKYxK7oTVdFR7pewjIee1hLMcF3M3goxAqKoobvlT93PeK81dLC5th3YSQ/exec";

  // ── 多言語メッセージ辞書 ──
  var MESSAGES={
    ja:{validationError:"入力内容を確認してください。",sending:"送信中...",success:"送信しました。ありがとうございます。",error:"送信できませんでした。時間を置いて再度お試しください。",submit:"送信する"},
    en:{validationError:"Please check your input.",sending:"Sending...",success:"Your message has been sent. Thank you.",error:"Failed to send. Please try again later.",submit:"Send"},
    it:{validationError:"Controlla i dati inseriti.",sending:"Invio in corso...",success:"Messaggio inviato. Grazie.",error:"Invio non riuscito. Riprova più tardi.",submit:"Invia"},
    id:{validationError:"Periksa kembali input Anda.",sending:"Mengirim...",success:"Pesan Anda telah terkirim. Terima kasih.",error:"Gagal mengirim. Silakan coba lagi nanti.",submit:"Kirim"},
    nl:{validationError:"Controleer uw invoer.",sending:"Verzenden...",success:"Uw bericht is verzonden. Bedankt.",error:"Verzenden mislukt. Probeer het later opnieuw.",submit:"Versturen"},
    el:{validationError:"Ελέγξτε τα στοιχεία σας.",sending:"Αποστολή...",success:"Το μήνυμά σας στάλθηκε. Ευχαριστούμε.",error:"Αποτυχία αποστολής. Δοκιμάστε ξανά αργότερα.",submit:"Αποστολή"},
    es:{validationError:"Revisa los datos introducidos.",sending:"Enviando...",success:"Mensaje enviado. Gracias.",error:"No se pudo enviar. Inténtalo más tarde.",submit:"Enviar"},
    "es-MX":{validationError:"Revisa los datos ingresados.",sending:"Enviando...",success:"Mensaje enviado. Gracias.",error:"No se pudo enviar. Inténtalo más tarde.",submit:"Enviar"},
    th:{validationError:"กรุณาตรวจสอบข้อมูลที่กรอก",sending:"กำลังส่ง...",success:"ส่งข้อความเรียบร้อยแล้ว ขอบคุณครับ",error:"ส่งไม่สำเร็จ กรุณาลองอีกครั้งภายหลัง",submit:"ส่ง"},
    de:{validationError:"Bitte überprüfen Sie Ihre Eingaben.",sending:"Wird gesendet...",success:"Ihre Nachricht wurde gesendet. Vielen Dank.",error:"Senden fehlgeschlagen. Bitte versuchen Sie es später erneut.",submit:"Absenden"},
    tr:{validationError:"Lütfen girdiğiniz bilgileri kontrol edin.",sending:"Gönderiliyor...",success:"Mesajınız gönderildi. Teşekkürler.",error:"Gönderilemedi. Lütfen daha sonra tekrar deneyin.",submit:"Gönder"},
    fr:{validationError:"Veuillez vérifier vos informations.",sending:"Envoi en cours...",success:"Votre message a été envoyé. Merci.",error:"Échec de l'envoi. Veuillez réessayer plus tard.",submit:"Envoyer"},
    vi:{validationError:"Vui lòng kiểm tra thông tin đã nhập.",sending:"Đang gửi...",success:"Tin nhắn đã được gửi. Cảm ơn bạn.",error:"Gửi không thành công. Vui lòng thử lại sau.",submit:"Gửi"},
    "pt-BR":{validationError:"Verifique os dados informados.",sending:"Enviando...",success:"Mensagem enviada. Obrigado.",error:"Falha ao enviar. Tente novamente mais tarde.",submit:"Enviar"},
    "pt-PT":{validationError:"Verifique os dados introduzidos.",sending:"A enviar...",success:"Mensagem enviada. Obrigado.",error:"Falha no envio. Tente novamente mais tarde.",submit:"Enviar"},
    ms:{validationError:"Sila semak maklumat anda.",sending:"Menghantar...",success:"Mesej anda telah dihantar. Terima kasih.",error:"Gagal menghantar. Sila cuba lagi kemudian.",submit:"Hantar"},
    ru:{validationError:"Проверьте введённые данные.",sending:"Отправка...",success:"Сообщение отправлено. Спасибо.",error:"Не удалось отправить. Попробуйте позже.",submit:"Отправить"},
    ko:{validationError:"입력 내용을 확인해 주세요.",sending:"전송 중...",success:"메시지가 전송되었습니다. 감사합니다.",error:"전송에 실패했습니다. 나중에 다시 시도해 주세요.",submit:"보내기"},
    "zh-Hans":{validationError:"请检查输入内容。",sending:"发送中...",success:"已发送。谢谢。",error:"发送失败，请稍后重试。",submit:"发送"},
    "zh-Hant":{validationError:"請檢查輸入內容。",sending:"傳送中...",success:"已送出。謝謝。",error:"傳送失敗，請稍後再試。",submit:"送出"}
  };

  // ── ページの言語判定 ──
  function detectLang(){
    var h=document.documentElement.lang||"ja";
    if(MESSAGES[h]) return h;
    var base=h.split("-")[0];
    if(MESSAGES[base]) return base;
    return "en";
  }

  // ── ブラウザ言語による自動リダイレクト（ルートのindex.htmlのみ） ──
  var LANG_FOLDERS=["en","it","id","nl","el","es","es-MX","th","de","tr","fr","vi","pt-BR","pt-PT","ms","ru","ko","zh-Hans","zh-Hant"];
  var LANG_MAP={"ja":"","en":"en","it":"it","id":"id","nl":"nl","el":"el","es":"es","es-MX":"es-MX","th":"th","de":"de","tr":"tr","fr":"fr","vi":"vi","pt-BR":"pt-BR","pt-PT":"pt-PT","ms":"ms","ru":"ru","ko":"ko","zh-Hans":"zh-Hans","zh-Hant":"zh-Hant"};

  function autoRedirect(){
    // ルートのページ（日本語版）でのみ動作
    if(document.documentElement.lang!=="ja") return;
    // 既にユーザーが手動で言語を選んだ場合はスキップ
    if(sessionStorage.getItem("lang-chosen")) return;

    var path=location.pathname;
    // ルート直下のページのみ対象（/index.html, /, /works.html 等）
    if(path.split("/").length>2 && path.split("/")[1]!=="") return;

    var browserLang=navigator.language||navigator.userLanguage||"";
    if(!browserLang) return;

    // 完全一致を試す（例: "pt-BR"）
    var target=null;
    var bl=browserLang;
    // navigator.languageは "pt-BR" や "zh-Hans" の形式
    // LANG_FOLDERS にマッチするか
    for(var i=0;i<LANG_FOLDERS.length;i++){
      if(bl.toLowerCase()===LANG_FOLDERS[i].toLowerCase()){
        target=LANG_FOLDERS[i];break;
      }
    }
    // ベース言語でフォールバック（例: "fr-FR" → "fr"）
    if(!target){
      var base=bl.split("-")[0].toLowerCase();
      // 中国語の特別処理: zh → zh-Hans
      if(base==="zh"){
        if(bl.toLowerCase().indexOf("hant")!==-1||bl.toLowerCase().indexOf("tw")!==-1||bl.toLowerCase().indexOf("hk")!==-1){
          target="zh-Hant";
        }else{
          target="zh-Hans";
        }
      }
      // ポルトガル語: pt → pt-BR（ブラジルの方が話者が多い）
      else if(base==="pt"){
        if(bl.toLowerCase().indexOf("pt")!==-1 && bl.toLowerCase()!=="pt-br"){
          target="pt-PT";
        }else{
          target="pt-BR";
        }
      }
      // スペイン語: es-MX はメキシコ、それ以外は es
      else if(base==="es"){
        if(bl.toLowerCase()==="es-mx"){
          target="es-MX";
        }else{
          target="es";
        }
      }
      else{
        for(var j=0;j<LANG_FOLDERS.length;j++){
          if(base===LANG_FOLDERS[j].toLowerCase()){
            target=LANG_FOLDERS[j];break;
          }
        }
      }
    }
    // 日本語の場合はそのまま
    if(!target||base==="ja") return;

    // 現在のページ名を取得
    var page=path.substring(path.lastIndexOf("/")+1)||"index.html";
    location.replace(target+"/"+page);
  }

  // DOMContentLoaded前にリダイレクト（フラッシュ防止）
  try{autoRedirect();}catch(e){}

  document.addEventListener("DOMContentLoaded",function(){
    var lang=detectLang();
    var msg=MESSAGES[lang];

    // ── ハンバーガーメニュー ──
    var btn=document.querySelector("[data-toggle]");
    var nav=document.getElementById("pe-nav");
    if(btn&&nav){
      btn.addEventListener("click",function(){
        var open=btn.getAttribute("aria-expanded")==="true";
        btn.setAttribute("aria-expanded",String(!open));
        nav.classList.toggle("is-open");
      });
    }

    // ── 言語ドロップダウン ──
    var langBtn=document.querySelector(".pe-lang-btn");
    var langDrop=document.querySelector(".pe-lang-drop");
    if(langBtn&&langDrop){
      langBtn.addEventListener("click",function(e){
        e.stopPropagation();
        langDrop.classList.toggle("is-open");
      });
      document.addEventListener("click",function(){
        langDrop.classList.remove("is-open");
      });
      // 手動で言語を選んだらリダイレクトを抑制
      var langLinks=langDrop.querySelectorAll("a");
      for(var i=0;i<langLinks.length;i++){
        langLinks[i].addEventListener("click",function(){
          sessionStorage.setItem("lang-chosen","1");
        });
      }
    }

    // ── コンタクトフォーム送信 ──
    var box=document.querySelector(".js-status");
    var form=document.getElementById("contact-form");
    if(form&&box){
      form.addEventListener("submit",function(e){
        e.preventDefault();

        var hp=form.querySelector("[name=url]");
        if(hp&&hp.value){return;}

        var name=form.querySelector("[name=name]").value.trim();
        var email=form.querySelector("[name=email]").value.trim();
        var message=form.querySelector("[name=message]").value.trim();

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
