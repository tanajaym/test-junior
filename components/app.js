function redirectToRes() {
  window.location.href = "./res.html";
}

document.addEventListener('DOMContentLoaded', function () {
  // Элементы формы
  const fromInput = document.getElementById('from');
  const toInput = document.getElementById('to');
  const rangeMin = document.querySelector('.range-min');
  const rangeMax = document.querySelector('.range-max');
  const bundlersSelect = document.getElementById('bundlers');
  const nameInput = document.querySelector('input[name="name"]');
  const ageInput = document.querySelector('input[name="age"]');
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const submitButton = document.querySelector('.button');
  const footerText = document.querySelector('.footer-text p');

  // Обновление года в footer
  const currentYear = new Date().getFullYear();
  footerText.textContent = `© Ева Соболева, ${currentYear}`; // Замените на свои данные

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
  }

  

  // Обработка отправки формы
  submitButton.addEventListener('click', function (event) {
      if (!document.querySelector('form').checkValidity()) {
          event.preventDefault();
          alert("Пожалуйста, заполните форму корректно.");
      } else {
          // Сохраняем данные и переходим на другую страницу
          const formData = {
              rangeFrom: fromInput.value,
              rangeTo: toInput.value,
              selectedOption: bundlersSelect.value,
              radioValue: document.querySelector('input[name="radio-container"]:checked')?.value || 'Не выбрано',
              fullName: nameInput.value,
              age: ageInput.value,
              checkbox1: checkboxes[0].checked,
              checkbox2: checkboxes[1].checked,
          };

          localStorage.setItem('formData', JSON.stringify(formData)); // Сохраняем данные
          window.location.href = './res.html'; // Переход на другую страницу
      }
  });
});