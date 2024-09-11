const getInitialValues = (formFields) => {
    const initialValues = {
        formData: {},
    };

    formFields.forEach((field) => {
        const { name, type, defaultValue } = field;
        switch (type) {
            case 'hidden':
                initialValues.formData[name] = defaultValue || '';
            case 'text':
                initialValues.formData[name] = defaultValue || '';
            case 'number':
                initialValues.formData[name] = defaultValue || 0;
            case 'decimal':
                initialValues.formData[name] = defaultValue || 0;
            case 'email':
                initialValues.formData[name] = defaultValue || '';     
            case 'textarea':
                initialValues.formData[name] = defaultValue || '';
            case 'file':
                initialValues.formData[name] = defaultValue || '';
                break;
            case 'checkbox':
                initialValues.formData[name] = defaultValue || false;
                break;
            case 'select':
                initialValues.formData[name] = defaultValue || '';
                break;
            case 'fieldarray':
                // Inicializa como un array con un objeto que contiene los valores por defecto de los subcampos
                initialValues.formData[name] = defaultValue || [field.fields.reduce((acc, subField) => {
                    acc[subField.name] = subField.defaultValue || ''; // O el valor por defecto que corresponda según el tipo de subField
                    return acc;
                }, {})];
                break;
            default:
                initialValues.formData[name] = '';
        }
    });

    return initialValues;
};

export default getInitialValues;
