(function () {
  "use strict";

  // SUBSTITUIR AQUI: texto inicial enviado nos botões gerais do WhatsApp.
  var defaultMessage = "Olá, Pedro Máquinas. Preciso de avaliação para conserto mecânico da minha lava e seca em Praia Grande. Pode me ajudar?";
  var root = document.querySelector(".site-shell");
  var whatsappNumber = root ? root.getAttribute("data-whatsapp") : "5513991275167";

  function buildWhatsappUrl(message) {
    return "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(message);
  }

  function getModelText() {
    var modelInput = document.querySelector("#machine-model");
    var model = modelInput ? modelInput.value.trim() : "";
    return model || "não informado";
  }

  function trackWhatsappClick(label) {
    var eventName = "whatsapp_click";
    var eventData = { event_category: "conversion", event_label: label || "unknown", value: 1 };

    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, eventData);
      // SUBSTITUIR AQUI: conversão Google Ads quando tiver label.
      // window.gtag("event", "conversion", { send_to: "AW-XXXXXXXXXX/CONVERSION_LABEL" });
    }

    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", "WhatsAppClick", { button_location: label || "unknown" });
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, button_location: label || "unknown" });
  }

  document.querySelectorAll(".js-whatsapp").forEach(function (button) {
    button.setAttribute("href", buildWhatsappUrl(defaultMessage));
    button.setAttribute("target", "_blank");
    button.setAttribute("rel", "noopener noreferrer");
    button.addEventListener("click", function () {
      trackWhatsappClick(button.getAttribute("data-event-label"));
    });
  });

  document.querySelectorAll(".problem-whatsapp").forEach(function (button) {
    button.addEventListener("click", function () {
      var problem = button.getAttribute("data-problem") || "Problema na máquina";
      var message =
        "Olá, Pedro Máquinas. Preciso de atendimento em Praia Grande.\n" +
        "Problema: " + problem + ".\n" +
        "Modelo da máquina: " + getModelText() + ".\n" +
        "Pode me passar uma orientação e orçamento?";

      trackWhatsappClick("problem_" + problem.toLowerCase().replace(/\s+/g, "_"));
      window.open(buildWhatsappUrl(message), "_blank", "noopener,noreferrer");
    });
  });

  var revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }
})();