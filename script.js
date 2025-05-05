let fields = [];

function addField() {
  const fieldId = Date.now();
  fields.push({ id: fieldId });

  const container = document.createElement('div');
  container.className = 'field-config';
  container.id = `field-${fieldId}`;
  container.innerHTML = `
    <label>Label: <input type="text" onchange="updateField(${fieldId}, 'label', this.value)" /></label>
    <label>Type:
      <select onchange="updateField(${fieldId}, 'type', this.value)">
        <option value="text">Text</option>
        <option value="number">Number</option>
        <option value="email">Email</option>
        <option value="dropdown">Dropdown</option>
      </select>
    </label>
    <label>Required: <input type="checkbox" onchange="updateField(${fieldId}, 'required', this.checked)" /></label>
    <div id="options-${fieldId}" style="display:none;">
      <label>Dropdown Options (comma-separated): <input type="text" onchange="updateField(${fieldId}, 'options', this.value)" /></label>
    </div>
    <button onclick="removeField(${fieldId})">Remove</button>
  `;

  document.getElementById('form-config').appendChild(container);
}

function updateField(id, key, value) {
  const field = fields.find(f => f.id === id);
  if (key === 'type') {
    document.getElementById(`options-${id}`).style.display = value === 'dropdown' ? 'block' : 'none';
  }
  field[key] = value;
}

function removeField(id) {
  fields = fields.filter(f => f.id !== id);
  document.getElementById(`field-${id}`).remove();
}

function generateForm() {
  const form = document.getElementById('dynamic-form');
  form.innerHTML = '';

  fields.forEach(field => {
    const fieldWrapper = document.createElement('div');
    fieldWrapper.innerHTML = `<label>${field.label || ''}${field.required ? ' *' : ''}</label>`;

    let input;
    if (field.type === 'dropdown') {
      input = document.createElement('select');
      if (field.options) {
        field.options.split(',').map(opt => opt.trim()).forEach(opt => {
          const option = document.createElement('option');
          option.value = opt;
          option.textContent = opt;
          input.appendChild(option);
        });
      }
    } else {
      input = document.createElement('input');
      input.type = field.type;
    }

    input.name = field.label;
    if (field.required) input.required = true;

    const error = document.createElement('div');
    error.className = 'error';
    error.style.display = 'none';

    fieldWrapper.appendChild(input);
    fieldWrapper.appendChild(error);
    form.appendChild(fieldWrapper);
  });

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Submit';
  form.appendChild(submitBtn);

  form.onsubmit = function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    let valid = true;

    Array.from(form.elements).forEach(el => {
      const error = el.nextElementSibling;
      if (el.required && !el.value) {
        error.textContent = 'This field is required';
        error.style.display = 'block';
        valid = false;
      } else {
        error.textContent = '';
        error.style.display = 'none';
      }
    });

    if (valid) {
      const data = {};
      formData.forEach((value, key) => data[key] = value);
      alert(JSON.stringify(data, null, 2));
    }
  }
}
