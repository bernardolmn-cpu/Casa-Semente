const menuButton = document.querySelector(".menu-toggle");
const siteNavigation = document.querySelector("#site-nav");

if (menuButton && siteNavigation) {
  const menuLabel = menuButton.querySelector(".visually-hidden");

  const toggleMenu = () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    if (menuLabel) {
      menuLabel.textContent = isOpen ? "Abrir menu" : "Fechar menu";
    }
    siteNavigation.classList.toggle("is-open", !isOpen);
  };

  menuButton.addEventListener("click", toggleMenu);

  siteNavigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 640) {
        menuButton.setAttribute("aria-expanded", "false");
        siteNavigation.classList.remove("is-open");
        if (menuLabel) menuLabel.textContent = "Abrir menu";
      }
    });
  });
}

const signupForm = document.querySelector(".signup-form");

if (signupForm) {
  const cpfInput = signupForm.querySelector("#cpf");
  const phoneInput = signupForm.querySelector("#telefone");
  const postalCodeInput = signupForm.querySelector("#cep");
  const birthDateInput = signupForm.querySelector("#nascimento");
  const formStatus = signupForm.querySelector("#form-status");
  const interestInputs = [...signupForm.querySelectorAll('input[name="interesse"]')];

  if (birthDateInput) {
    const today = new Date();
    birthDateInput.max = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0")
    ].join("-");
  }

  function validateInterest() {
    if (!interestInputs.length) return;
    const hasInterest = interestInputs.some((input) => input.checked);
    interestInputs[0].setCustomValidity(hasInterest ? "" : "Selecione ao menos uma forma de colaboração.");
  }

  interestInputs.forEach((input) => {
    input.addEventListener("change", validateInterest);
  });
  validateInterest();

  function formatDigits(value, formatter, limit) {
    return formatter(value.replace(/\D/g, "").slice(0, limit));
  }

  function formatCpf(digits) {
    const value = digits.replace(/\D/g, "").slice(0, 11);
    return value
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3}\.\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3}\.\d{3}\.\d{3})(\d)/, "$1-$2");
  }

  function formatPhone(digits) {
    const value = digits.replace(/\D/g, "").slice(0, 11);
    if (value.length < 3) return value ? `(${value}` : "";
    const areaCode = value.slice(0, 2);
    const rest = value.slice(2);
    if (rest.length <= 4) return `(${areaCode}) ${rest}`;
    const splitAt = value.length > 10 ? 5 : 4;
    return `(${areaCode}) ${rest.slice(0, splitAt)}-${rest.slice(splitAt)}`;
  }

  function isValidCpf(value) {
    const digits = value.replace(/\D/g, "");
    if (digits.length !== 11 || /^([0-9])\1{10}$/.test(digits)) return false;

    for (let checkIndex = 9; checkIndex < 11; checkIndex += 1) {
      let sum = 0;
      for (let digitIndex = 0; digitIndex < checkIndex; digitIndex += 1) {
        sum += Number(digits[digitIndex]) * (checkIndex + 1 - digitIndex);
      }
      const remainder = (sum * 10) % 11;
      const expectedDigit = remainder === 10 ? 0 : remainder;
      if (expectedDigit !== Number(digits[checkIndex])) return false;
    }
    return true;
  }

  if (cpfInput) {
    cpfInput.addEventListener("input", () => {
      cpfInput.value = formatDigits(cpfInput.value, formatCpf, 11);
      cpfInput.setCustomValidity(cpfInput.value && !isValidCpf(cpfInput.value) ? "Informe um CPF válido." : "");
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener("input", () => {
      phoneInput.value = formatDigits(phoneInput.value, formatPhone, 11);
    });
  }

  if (postalCodeInput) {
    postalCodeInput.addEventListener("input", () => {
      postalCodeInput.value = formatDigits(postalCodeInput.value, (digits) => digits.replace(/^(\d{5})(\d)/, "$1-$2"), 8);
    });
  }

  signupForm.addEventListener("submit", (event) => {
    if (!signupForm.checkValidity()) {
      return;
    }

    event.preventDefault();
    if (formStatus) {
      formStatus.textContent = "Cadastro validado. Esta demonstração não enviou nem armazenou seus dados.";
      formStatus.hidden = false;
      formStatus.focus();
    }
  });
}