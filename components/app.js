"use strict";

function initializeCustomSelect() {
  const customSelects = document.getElementsByClassName("custom-select");

  for (let i = 0; i < customSelects.length; i++) {
    const selectElement = customSelects[i].getElementsByTagName("select")[0];
    const optionsCount = selectElement.length;

    const selectedDiv = document.createElement("DIV");
    selectedDiv.setAttribute("class", "select-selected");
    selectedDiv.innerHTML = selectElement.options[selectElement.selectedIndex].innerHTML;
    customSelects[i].appendChild(selectedDiv);

    const optionsDiv = document.createElement("DIV");
    optionsDiv.setAttribute("class", "select-items select-hide");

    // Добавляем опции в список
    for (let j = 1; j < optionsCount; j++) {
      const optionDiv = document.createElement("DIV");
      optionDiv.innerHTML = selectElement.options[j].innerHTML;

      optionDiv.addEventListener("click", function (e) {
        const select = this.parentNode.parentNode.getElementsByTagName("select")[0];
        const selectedHeader = this.parentNode.previousSibling;
        const selectedOptions = this.parentNode.getElementsByClassName("same-as-selected");

        for (let k = 0; k < select.length; k++) {
          if (select.options[k].innerHTML === this.innerHTML) {
            select.selectedIndex = k;
            selectedHeader.innerHTML = this.innerHTML;

            for (let m = 0; m < selectedOptions.length; m++) {
              selectedOptions[m].removeAttribute("class");
            }

            this.setAttribute("class", "same-as-selected");
            break;
          }
        }

        selectedHeader.click();
      });
      optionsDiv.appendChild(optionDiv);
    }

    // Добавляем список опций в DOM
    customSelects[i].appendChild(optionsDiv);

    selectedDiv.addEventListener("click", function (e) {
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
  }

  function closeAllSelect(currentElement) {
    const allSelectItems = document.getElementsByClassName("select-items");
    const allSelectedHeaders = document.getElementsByClassName("select-selected");
    const exceptions = [];

    for (let i = 0; i < allSelectedHeaders.length; i++) {
      if (currentElement === allSelectedHeaders[i]) {
        exceptions.push(i);
      } else {
        allSelectedHeaders[i].classList.remove("select-arrow-active");
      }
    }

    for (let i = 0; i < allSelectItems.length; i++) {
      if (!exceptions.includes(i)) {
        allSelectItems[i].classList.add("select-hide");
      }
    }
  }

  // Закрытие списка
  document.addEventListener("click", closeAllSelect);
}

document.addEventListener("DOMContentLoaded", function () {
  initializeCustomSelect();

  const fromInput = document.querySelector('input[placeholder="От 0"]');
  const toInput = document.querySelector('input[placeholder="До 100"]');
  const rangeMin = document.querySelector(".range-min");
  const rangeMax = document.querySelector(".range-max");
  const bundlersSelect = document.querySelector('select[name="bundlers"]');
  const nameInput = document.querySelector('input[name="name"]');
  const ageInput = document.querySelector('input[name="age"]');
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const submitButton = document.querySelector(".button");
  const footerText = document.querySelector(".footer-text p");
  const form = document.querySelector("form");
  const resultsContainer = document.createElement("div"); // Контейнер для результатов
  resultsContainer.classList.add("results-container");
  document.body.appendChild(resultsContainer); // Добавляем контейнер на страницу

  // Обновление года в footer
  const currentYear = new Date().getFullYear();
  footerText.textContent = `© Ева Соболева, ${currentYear}`;

  // Валидация range
  function validateRange() {
    let from = parseInt(fromInput.value) || 0;
    let to = parseInt(toInput.value) || 150;

    from = Math.max(0, Math.min(150, from));
    to = Math.max(0, Math.min(150, to));

    if (from > to) {
      [from, to] = [to, from];
    }

    fromInput.value = from;
    toInput.value = to;
    rangeMin.value = from;
    rangeMax.value = to;

    return { from, to };
  }

  // Обновление полей ввода при перемещении ползунков
  rangeMin.addEventListener("input", () => {
    fromInput.value = rangeMin.value;
    validateRange();
  });

  rangeMax.addEventListener("input", () => {
    toInput.value = rangeMax.value;
    validateRange();
  });

  fromInput.addEventListener("input", validateRange);
  toInput.addEventListener("input", validateRange);

  // Валидация select
  bundlersSelect.addEventListener("change", function () {
    if (this.value === "") {
      this.setCustomValidity("Пожалуйста, выберите опцию.");
    } else {
      this.setCustomValidity("");
    }
    this.reportValidity();
  });

  // Валидация ФИО
  nameInput.addEventListener("input", function () {
    const words = this.value.split(" ").filter((word) => word.length >= 2);
    if (words.length !== 3 || /\d/.test(this.value)) {
      this.setCustomValidity("Введите корректное ФИО (3 слова, минимум 2 символа в каждом, без цифр).");
    } else {
      this.setCustomValidity("");
    }
    this.reportValidity();
  });

  // Валидация возраста
  ageInput.addEventListener("input", function () {
    if (!/^\d+$/.test(this.value)) {
      this.setCustomValidity("Введите только цифры.");
    } else {
      this.setCustomValidity("");
    }
    this.reportValidity();
  });

  // Валидация checkbox
  submitButton.addEventListener("click", function (event) {
    if (!checkboxes[0].checked) {
      event.preventDefault();
      alert("Пожалуйста, отметьте обязательный checkbox.");
    }
  });

  submitButton.addEventListener("click", function (event) {
    // Проверяем валидность всей формы
    if (!form.checkValidity()) {
      event.preventDefault();
      alert("Пожалуйста, заполните все поля корректно.");
    } else {
      const isFormValid =
        fromInput.value !== "" &&
        toInput.value !== "" &&
        bundlersSelect.value !== "" &&
        nameInput.value !== "" &&
        ageInput.value !== "" &&
        checkboxes[0].checked;

      if (isFormValid) {
        const { from, to } = validateRange();

        const formData = {
          rangeFrom: from,
          rangeTo: to,
          selectedOption: bundlersSelect.value,
          radioValue: document.querySelector('input[name="radio-container"]:checked')?.value || "Не выбрано",
          fullName: nameInput.value,
          age: ageInput.value,
          checkbox1: checkboxes[0].checked,
          checkbox2: checkboxes[1].checked,
        };

        // Отображаем результаты на странице
        const resultElement = document.createElement("div");
        resultElement.classList.add("result-item");
        resultElement.innerHTML = `
          <p><strong>Диапазон:</strong> от ${formData.rangeFrom} до ${formData.rangeTo}</p>
          <p><strong>Выбранный bundler:</strong> ${formData.selectedOption}</p>
          <p><strong>Выбранный язык:</strong> ${formData.radioValue}</p>
          <p><strong>ФИО:</strong> ${formData.fullName}</p>
          <p><strong>Возраст:</strong> ${formData.age}</p>
          <p><strong>Обязательный checkbox:</strong> ${formData.checkbox1 ? "Отмечен" : "Не отмечен"}</p>
          <p><strong>Необязательный checkbox:</strong> ${formData.checkbox2 ? "Отмечен" : "Не отмечен"}</p>
        `;

        resultsContainer.appendChild(resultElement);
        form.reset(); // Очищаем форму
      } else {
        event.preventDefault();
        alert("Пожалуйста, заполните все поля корректно");
      }
    }
  });
});