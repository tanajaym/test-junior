function getRes() {
  window.location.href = "./res.html";
}

document.addEventListener('DOMContentLoaded', function () {
  const fromInput = document.querySelector('input[placeholder="От 0"]');
  const toInput = document.querySelector('input[placeholder="До 100"]');
  const rangeMin = document.querySelector('.range-min');
  const rangeMax = document.querySelector('.range-max');
  const bundlersSelect = document.querySelector('select[name="bundlers"]');
  const nameInput = document.querySelector('input[name="name"]');
  const ageInput = document.querySelector('input[name="age"]');
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const submitButton = document.querySelector('.button');
  const footerText = document.querySelector('.footer-text p');
  const form = document.querySelector('form');

  // Обновление года в footer
  const currentYear = new Date().getFullYear();
  footerText.textContent = `© Ева Соболева, ${currentYear}`;

  // Валидация диапазона
  function validateRange() {
      let from = parseInt(fromInput.value) || 0;
      let to = parseInt(toInput.value) || 150;

      // Ограничение значений от 0 до 150
      from = Math.max(0, Math.min(150, from));
      to = Math.max(0, Math.min(150, to));

      if (from > to) {
          [from, to] = [to, from];
      }

      fromInput.value = from;
      toInput.value = to;
      rangeMin.value = from;
      rangeMax.value = to;

      return { from, to }; // Возвращаем значения from и to
  }

  // Вызов validateRange при изменении значений полей "От" и "До"
  fromInput.addEventListener('input', validateRange);
  toInput.addEventListener('input', validateRange);

  // Валидация select
  bundlersSelect.addEventListener('change', function () {
      if (this.value === "") {
          this.setCustomValidity("Пожалуйста, выберите опцию.");
      } else {
          this.setCustomValidity("");
      }
      this.reportValidity();
  });

  // Валидация ФИО
  nameInput.addEventListener('input', function () {
      const words = this.value.split(' ').filter(word => word.length >= 2);
      if (words.length !== 3 || /\d/.test(this.value)) {
          this.setCustomValidity("Введите корректное ФИО (3 слова, минимум 2 символа в каждом, без цифр).");
      } else {
          this.setCustomValidity("");
      }
      this.reportValidity();
  });

  // Валидация возраста
  ageInput.addEventListener('input', function () {
      if (!/^\d+$/.test(this.value)) {
          this.setCustomValidity("Введите только цифры.");
      } else {
          this.setCustomValidity("");
      }
      this.reportValidity();
  });

  // Валидация checkbox
  submitButton.addEventListener('click', function (event) {
      if (!checkboxes[0].checked) {
          event.preventDefault();
          alert("Пожалуйста, отметьте обязательный checkbox.");
      }
  });

  // Обработка отправки формы
  submitButton.addEventListener('click', function (event) {
      // Проверяем валидность всей формы
      if (!form.checkValidity()) {
          event.preventDefault();
          alert("Пожалуйста, заполните все поля корректно.");
      } else {
          // Проверяем, что все поля заполнены корректно
          const isFormValid = (
              fromInput.value !== "" &&
              toInput.value !== "" &&
              bundlersSelect.value !== "" &&
              nameInput.value !== "" &&
              ageInput.value !== "" &&
              checkboxes[0].checked
          );

          if (isFormValid) {
              // Вызываем validateRange и получаем значения from и to
              const { from, to } = validateRange();

              // Сохраняем данные и переходим на другую страницу
              const formData = {
                  rangeFrom: from, // Используем значение from из validateRange
                  rangeTo: to, // Используем значение to из validateRange
                  selectedOption: bundlersSelect.value,
                  radioValue: document.querySelector('input[name="radio-container"]:checked')?.value || 'Не выбрано',
                  fullName: nameInput.value,
                  age: ageInput.value,
                  checkbox1: checkboxes[0].checked,
                  checkbox2: checkboxes[1].checked,
              };

              localStorage.setItem('formData', JSON.stringify(formData));
              getRes();
          } else {
              event.preventDefault();
              alert("Пожалуйста, заполните все поля корректно.");
          }
      }
  });
});