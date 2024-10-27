import React, { useState, useEffect } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import axios from 'axios';
import FixedBar from '@/components/ui/ProgressBar/FixedBarAlert'

// Asumiendo que tienes estos componentes definidos
import { Input, FileInput, NestedSelectInput, DecimalInput, NumberInput, SelectInput } from '@/components/form/Form';
import TextArea from '@/components/ui/RichTextEditor';
import { productData } from "@/constant/apiData";
import Buttons from '@/components/ui/Button';

const MyForm = ({ objID, refreshData, closeModal }) => {
    const [isLoadingForm, setIsLoadingForm] = useState(false);
    const [sendingForm, setSendingForm] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFile2, setSelectedFile2] = useState(null);
    const [categoriesList, setCategoriesList] = useState(null);
    const [apiSignal, setApiSignal] = useState(false);
    const [formData, setFormData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [finalSubcategories, setFinalSubcategories] = useState([]);
    const [selectedFinalSubcategory, setSelectedFinalSubcategory] = useState(null);
    const [fourthSubcategories, setFourthSubcategories] = useState([]);
    const [selectedFourthSubcategory, setSelectedFourthSubcategory] = useState(null);
    const [progress, setProgress] = useState(0);
    const [categoryName, setCategoryName] = useState(null);
    const [subCategoryName, setSubCategoryName] = useState(null);
    const [subCategoryName2, setSubCategoryName2] = useState(null);
    const [subCategoryName3, setSubCategoryName3] = useState(null);

    const showMissingCategory = !categoryName || !subCategoryName || !subCategoryName2 || !subCategoryName3;

    useEffect(() => {
        setCategories(category);
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            if (apiSignal) {
                if (categoriesList) {
                    const { subcategory2, subcategory3 } = categoriesList;
                    const categoryData = categories.find(cat => cat.name === subcategory3);
                    const subcategoriesForCategory = categoryData.subcategory.find(subcat => subcat.name === subcategory2);
                    setSelectedSubcategory(subcategoriesForCategory.id)
                    setSubCategoryName(subcategoriesForCategory.name);
                    setSubcategories(categoryData.subcategory);
                } else {
                    const subcategoriesForCategory = category.find(
                        (cat) => cat.id === selectedCategory
                    ).subcategory;
                    const categoryName = category.find((cat) => cat.id === selectedCategory).name;
                    setCategoryName(categoryName);
                    setSubcategories(subcategoriesForCategory);
                    setSelectedSubcategory(null);
                    setSelectedFinalSubcategory(null);
                    setSelectedFourthSubcategory(null);
                }
            } else {
                const subcategoriesForCategory = category.find(
                    (cat) => cat.id === selectedCategory
                ).subcategory;
                const categoryName = category.find((cat) => cat.id === selectedCategory).name;
                setCategoryName(categoryName);
                setSubCategoryName(null);
                setSubCategoryName2(null);
                setSubCategoryName3(null);
                setSubcategories(subcategoriesForCategory);
                setSelectedSubcategory(null);
                setSelectedFinalSubcategory(null);
                setSelectedFourthSubcategory(null);
            }

        } else if (selectedCategory == 0) {
            setSelectedCategory(null);
            setSelectedSubcategory(null);
            setSelectedFinalSubcategory(null);
            setSelectedFourthSubcategory(null);
        }
        else {
            // No se necesita reiniciar ningún estado aquí, ya que se inicializan
            // a null por defecto en su declaración
        }
    }, [selectedCategory, categoriesList, categories]);

    useEffect(() => {
        if (selectedSubcategory) {
            if (apiSignal) {
                if (categoriesList) {
                    const { subcategory, subcategory2, subcategory3 } = categoriesList;
                    const categoryData = categories.find(cat => cat.name === subcategory3);
                    const subcategoriesForCategory = categoryData.subcategory.find(subcat => subcat.name === subcategory2);
                    const finalSubcategoriesForSubcategory = subcategoriesForCategory.subcategory.find(subcat => subcat.name === subcategory);
                    setSelectedFinalSubcategory(finalSubcategoriesForSubcategory.id)
                    setSubCategoryName2(finalSubcategoriesForSubcategory.name);
                    setFinalSubcategories(subcategoriesForCategory.subcategory);
                } else {
                    const finalSubcategoriesForSubcategory = subcategories.find(
                        (subcat) => subcat.id === selectedSubcategory
                    ).subcategory;
                    setSubCategoryName(subcategories.find((subcat) => subcat.id === selectedSubcategory).name);
                    setSubCategoryName2(null);
                    setSubCategoryName3(null);
                    setFinalSubcategories(finalSubcategoriesForSubcategory);
                    setSelectedFinalSubcategory(null);
                    setSelectedFourthSubcategory(null);
                }
            } else {
                const finalSubcategoriesForSubcategory = subcategories.find(
                    (subcat) => subcat.id === selectedSubcategory
                ).subcategory;
                setSubCategoryName(subcategories.find((subcat) => subcat.id === selectedSubcategory).name);
                setSubCategoryName2(null);
                setSubCategoryName3(null);
                setFinalSubcategories(finalSubcategoriesForSubcategory);
                setSelectedFinalSubcategory(null);
                setSelectedFourthSubcategory(null);
            }

        } else {
            setFinalSubcategories([]);
            setSelectedFinalSubcategory(null);
            setSelectedFourthSubcategory(null);
        }
    }, [selectedSubcategory, categoriesList, categories]);

    useEffect(() => {
        if (selectedFinalSubcategory) {
            if (apiSignal) {
                if (categoriesList) {
                    const { category, subcategory, subcategory2, subcategory3 } = categoriesList;
                    const categoryData = categories.find(cat => cat.name === subcategory3);
                    const subcategoriesForCategory = categoryData.subcategory.find(subcat => subcat.name === subcategory2);
                    const finalSubcategoriesForSubcategory = subcategoriesForCategory.subcategory.find(subcat => subcat.name === subcategory);
                    const fourthSubcategoriesForSubcategory = finalSubcategoriesForSubcategory.subcategory.find(subcat => subcat.name === category);
                    setSelectedFourthSubcategory(fourthSubcategoriesForSubcategory.id)
                    setSubCategoryName3(fourthSubcategoriesForSubcategory.name);
                    setFourthSubcategories(finalSubcategoriesForSubcategory.subcategory);
                } else {
                    const fourthSubcategoriesForSubcategory = finalSubcategories.find(
                        (subcat) => subcat.id === selectedFinalSubcategory
                    ).subcategory;
                    setSubCategoryName2(finalSubcategories.find((subcat) => subcat.id === selectedFinalSubcategory).name);
                    setSubCategoryName3(null);
                    setFourthSubcategories(fourthSubcategoriesForSubcategory);
                    setSelectedFourthSubcategory(null);
                }
            } else {
                const fourthSubcategoriesForSubcategory = finalSubcategories.find(
                    (subcat) => subcat.id === selectedFinalSubcategory
                ).subcategory;
                setSubCategoryName2(finalSubcategories.find((subcat) => subcat.id === selectedFinalSubcategory).name);
                setSubCategoryName3(null);
                setFourthSubcategories(fourthSubcategoriesForSubcategory);
                setSelectedFourthSubcategory(null);
            }

        } else {
            setFourthSubcategories([]);
            setSelectedFourthSubcategory(null);
        }
    }, [selectedFinalSubcategory, categoriesList, categories]);

    useEffect(() => {
        if (selectedFourthSubcategory) {
            if (apiSignal) {
                if (categoriesList) {
                    setApiSignal(false);
                }
                else {
                    setApiSignal(false);
                    setSubCategoryName3(fourthSubcategories.find((subcat) => subcat.id === selectedFourthSubcategory).name);
                }
            } else {
                setSubCategoryName3(fourthSubcategories.find((subcat) => subcat.id === selectedFourthSubcategory).name);
            }

        }
    }, [selectedFourthSubcategory, categoriesList, categories]);

    // cambio de estado categorías seleccionadas
    useEffect(() => {
        if (selectedCategory) {
            const categoryData = category.find((cat) => cat.id === selectedCategory).name;
            setCategoryName(categoryData);

        }
    }, [categoryName]);

    useEffect(() => {
        if (selectedSubcategory) {
            setSubCategoryName(subcategories.find((subcat) => subcat.id === selectedSubcategory).name);
        }
    }, [subCategoryName]);

    useEffect(() => {
        if (selectedFinalSubcategory) {
            setSubCategoryName2(finalSubcategories.find((subcat) => subcat.id === selectedFinalSubcategory).name);
        }
    }, [subCategoryName2]);

    useEffect(() => {
        if (selectedFourthSubcategory) {
            setSubCategoryName3(fourthSubcategories.find((subcat) => subcat.id === selectedFourthSubcategory).name);
        }
    }, [subCategoryName3]);

    const handleCategoryChange = (event) => {
        if (event.target.value === 0) {
            setSelectedCategory(null);
            setSelectedSubcategory(null);
            setSelectedFinalSubcategory(null);
            setSelectedFourthSubcategory(null);
        } else {
            setSelectedCategory(parseInt(event.target.value));
            setSubcategories([]);
            setSelectedSubcategory(null);
        }

    };

    const handleSubcategoryChange = (event) => {
        if (event.target.value === 0) {
            setSelectedCategory(null);
            setSelectedSubcategory(null);
            setSelectedFinalSubcategory(null);
            setSelectedFourthSubcategory(null);
        } else {
            setSelectedSubcategory(parseInt(event.target.value));
            setFinalSubcategories([]);
            setSelectedFourthSubcategory(null);
        }
    };

    const handleFinalSubcategoryChange = (event) => {
        if (event.target.value === 0) {
            setSelectedCategory(null);
            setSelectedSubcategory(null);
            setSelectedFinalSubcategory(null);
            setSelectedFourthSubcategory(null);
        } else {
            setSelectedFinalSubcategory(parseInt(event.target.value));
            setFourthSubcategories([]);
        }
    };

    const handleFourthSubcategoryChange = (event) => {
        setSelectedFourthSubcategory(parseInt(event.target.value));
    };

    const formikObj = [];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setApiSignal(true);
                setIsLoadingForm(true);
                const res = await productData();
                let parent = res.products.filter(item => item.id === objID);
                if (parent.length === 1) {
                    parent = parent[0];

                    const child = res.variants.filter(item => item.product === parent.id);

                    formikObj.push(parent);
                    formikObj.push(child);
                    setFormData(formikObj)
                    setCategoriesList(parent.categories);

                } else {
                    console.warn("No 'data' component found!");
                }
            } catch (error) {
                console.error("Error fetching items:", error);
            } finally {
                setIsLoadingForm(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (values) => {
        setSendingForm(true);
        const formData = new FormData();
        formData.append('parent_id', values.inputs.parent.id);
        formData.append(`category`, categoryName);
        formData.append(`subcategory`, subCategoryName);
        formData.append(`subcategory2`, subCategoryName2);
        formData.append(`subcategory3`, subCategoryName3);
        formData.append(`title`, values.inputs.parent.title);
        formData.append(`status`, values.inputs.parent.status);
        formData.append(`description`, values.inputs.parent.description);
        formData.append('image', selectedFile);
        formData.append('parent_type', 'product')
        values.inputs.child.forEach((input, index) => {
            formData.append(`inputs[${index}][id]`, input.id);
            formData.append(`inputs[${index}][status]`, input.status);
            formData.append(`inputs[${index}][color]`, input.color);
            formData.append(`inputs[${index}][size]`, input.size);
            formData.append(`inputs[${index}][image]`, selectedFile2);
            formData.append(`inputs[${index}][price]`, input.price);
            formData.append(`inputs[${index}][stock]`, input.stock);
            formData.append(`inputs[${index}][content_type]`, 'product_variant');
        });
        const formDataObject = {};
        for (const [key, value] of formData.entries()) {
            formDataObject[key] = value;
        }

        // Mostrar el objeto plano en la consola
        console.log('Valores del formulario:', formDataObject);
        
        try {
            const response = await axios.post('http://127.0.0.1:8000/v1/inventory/create_product/', formData, {
              onUploadProgress: (event) => {
                const percent = Math.round((event.loaded / event.total) * 100);
                setProgress(percent);
              },
            });
      
            if (!response.status >= 200 && response.status < 300) {
              throw new Error(`Error en la solicitud: ${response.status}`);
            }
      
          } catch (error) {
            console.error('Error al enviar el formulario:', error);
          } finally {
            setSendingForm(false);
            refreshData();
            closeModal();
          }
    };

    const handleFileChange = (file) => {
        setSelectedFile(file);
    };

    const handleFileChange2 = (file) => {
        setSelectedFile2(file);
    };

    const initialValues = {
        inputs: formData && formData.length > 0
          ? {
              parent: formData[0] || { status: '', category: '', subcategory: '', subcategory2: '', subcategory3: '', title: '', description: '', image: ''},
              child: formData[1].length > 0 ? formData[1] : [{ status: '', color: '', size: '', price: '', stock: '' }]
            }
          : {
              parent: { status: '', category: '', subcategory: '', subcategory2: '', subcategory3: '', title: '', description: '', image: '' },
              child: [{ status: '', color: '', size: '', price: '', stock: ''}]
            }
      };


    const category = [
        {
            id: 0,
            name: "Seleccionar categoría", // Opción disabled sin value
            disabled: true, // Añadir el atributo disabled
            subcategory: [],
        },
        {
            id: 1,
            name: 'Ropa',
            subcategory: [
                {
                    id: 0,
                    name: "Seleccionar categoría", // Opción disabled sin value
                    disabled: true, // Añadir el atributo disabled
                    subcategory: [],
                },
                {
                    id: 11,
                    name: 'Mujer',
                    subcategory: [
                        {
                            id: 0,
                            name: "Seleccionar categoría", // Opción disabled sin value
                            disabled: true, // Añadir el atributo disabled
                            subcategory: [],
                        },
                        {
                            id: 112,
                            name: 'Accessorios',
                            subcategory: [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { id: 1121, name: 'Aretes' },
                                { id: 1122, name: 'Collares' },
                                { id: 1123, name: 'Pulseras' },
                                { id: 1124, name: 'Anillos' },
                                { id: 1125, name: 'Cinturones' },
                                { id: 1126, name: 'Bolsos' },
                                { id: 1127, name: 'Carteras' },
                                { id: 1128, name: 'Pañuelos' },
                                { id: 1129, name: 'Gafas de sol' },
                                { id: 1130, name: 'Sombreros' },
                            ]
                        },
                        {
                            id: 113,
                            name: 'Blusas',
                            subcategory: [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { id: 1121, name: 'Blusas de algodón' },
                                { id: 1122, name: 'Blusas de seda' },
                                { id: 1123, name: 'Blusas de lino' },
                                { id: 1124, name: 'Blusas de encaje' },
                                { id: 1125, name: 'Blusas de manga larga' },
                                { id: 1126, name: 'Blusas de manga corta' },
                                { id: 1127, name: 'Blusas sin mangas' },
                                { id: 1128, name: 'Blusas de cuello redondo' },
                                { id: 1129, name: 'Blusas de cuello en V' },
                                { id: 1130, name: 'Blusas con botones' },
                                { id: 1131, name: 'Blusas con cremallera' },
                                { id: 1132, name: 'Blusas estampadas' },
                                { id: 1133, name: 'Blusas lisas' },
                                // ... más subcategorías de Blusas
                            ]
                        },
                        {
                            id: 114,
                            name: 'Camisas',
                            subcategory: [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { id: 1121, name: 'Camisas de vestir' },
                                { id: 1122, name: 'Camisas casuales' },
                                { id: 1123, name: 'Camisas de manga larga' },
                                { id: 1124, name: 'Camisas de manga corta' },
                                { id: 1125, name: 'Camisas sin mangas' },
                                { id: 1126, name: 'Camisas de algodón' },
                                { id: 1127, name: 'Camisas de lino' },
                                { id: 1128, name: 'Camisas de seda' },
                                { id: 1129, name: 'Camisas a cuadros' },
                                { id: 1130, name: 'Camisas a rayas' },
                                { id: 1131, name: 'Camisas lisas' },
                                { id: 1132, name: 'Camisas con botones' },
                                { id: 1133, name: 'Camisas con cuello' },
                                // ... más subcategorías de Camisas
                            ]
                        },
                        {
                            id: 115,
                            name: 'Pantalones',
                            subcategory: [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { id: 1121, name: 'Pantalones de vestir' },
                                { id: 1122, name: 'Pantalones casuales' },
                                { id: 1123, name: 'Pantalones de mezclilla' },
                                { id: 1124, name: 'Pantalones de yoga' },
                                { id: 1125, name: 'Pantalones de chándal' },
                                { id: 1126, name: 'Pantalones de pinzas' },
                                { id: 1127, name: 'Pantalones palazzo' },
                                { id: 1128, name: 'Pantalones de pierna ancha' },
                                { id: 1129, name: 'Pantalones de pierna estrecha' },
                                { id: 1130, name: 'Pantalones capri' },
                                { id: 1131, name: 'Pantalones cortos' },
                                { id: 1132, name: 'Pantalones de cintura alta' },
                                { id: 1133, name: 'Pantalones de cintura baja' },
                                // ... más subcategorías de Pantalones
                            ]
                        },
                        {
                            id: 116,
                            name: 'Vestidos',
                            subcategory: [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { id: 1111, name: 'Vestidos de cóctel' },
                                { id: 1112, name: 'Vestidos de gala' },
                                { id: 1113, name: 'Vestidos casuales' },
                                { id: 1114, name: 'Vestidos de verano' },
                                { id: 1115, name: 'Vestidos de invierno' },
                                { id: 1116, name: 'Vestidos de encaje' },
                                { id: 1117, name: 'Vestidos de algodón' },
                                { id: 1118, name: 'Vestidos de seda' },
                                { id: 1119, name: 'Vestidos de lino' },
                                { id: 1120, name: 'Vestidos de manga larga' },
                                { id: 1121, name: 'Vestidos de manga corta' },
                                { id: 1122, name: 'Vestidos sin mangas' },
                                // ... más subcategorías de Vestidos
                            ]
                        },
                        {
                            id: 117,
                            name: 'Calzado',
                            subcategory: [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { id: 1121, name: 'Zapatos de tacón' },
                                { id: 1122, name: 'Zapatos planos' },
                                { id: 1123, name: 'Sandalias' },
                                { id: 1124, name: 'Botas' },
                                { id: 1125, name: 'Zapatillas deportivas' },
                                { id: 1126, name: 'Zapatillas de ballet' },
                                { id: 1127, name: 'Mocasines' },
                                { id: 1128, name: 'Zuecos' },
                                { id: 1129, name: 'Pantuflas' },
                                { id: 1130, name: 'Calzado de lluvia' },
                                // ... más subcategorías de Calzado
                            ]
                        },
                        {
                            id: 118,
                            name: 'Ropa Interior',
                            subcategory: [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { id: 1121, name: 'Sujetadores' },
                                { id: 1122, name: 'Brasieres' },
                                { id: 1123, name: 'Calzones' },
                                { id: 1124, name: 'Tangas' },
                                { id: 1125, name: 'Bragas' },
                                { id: 1126, name: 'Pijamas' },
                                { id: 1127, name: 'Batas' },
                                { id: 1128, name: 'Medias' },
                                { id: 1129, name: 'Calcetines' },
                                { id: 1130, name: 'Corsés' },
                                { id: 1131, name: 'Bodies' },
                                { id: 1132, name: 'Ropa interior térmica' },
                                // ... más subcategorías de Ropa Interior
                            ]
                        },
                        // ... más subcategorías de Mujer
                    ],
                },
                {
                    "id": 12,
                    "name": "Hombre",
                    "subcategory": [
                        {
                            id: 0,
                            name: "Seleccionar categoría", // Opción disabled sin value
                            disabled: true, // Añadir el atributo disabled
                            subcategory: [],
                        },
                        {
                            "id": 121,
                            "name": "Camisas",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 1211, "name": "Camisas de vestir" },
                                { "id": 1212, "name": "Camisas casuales" },
                                { "id": 1213, "name": "Camisas de manga larga" },
                                { "id": 1214, "name": "Camisas de manga corta" },
                                { "id": 1215, "name": "Camisas de algodón" },
                                { "id": 1216, "name": "Camisas de lino" },
                                { "id": 1217, "name": "Camisas de seda" },
                                { "id": 1218, "name": "Camisas a cuadros" },
                                { "id": 1219, "name": "Camisas a rayas" },
                                { "id": 1220, "name": "Camisas lisas" },
                                { "id": 1221, "name": "Camisas con botones" },
                                { "id": 1222, "name": "Camisas con cuello" },
                                // ... más subcategorías de Camisas
                            ]
                        },
                        {
                            "id": 122,
                            "name": "Pantalones",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 1221, "name": "Pantalones de vestir" },
                                { "id": 1222, "name": "Pantalones casuales" },
                                { "id": 1223, "name": "Pantalones de mezclilla" },
                                { "id": 1224, "name": "Pantalones de chándal" },
                                { "id": 1225, "name": "Pantalones de pinzas" },
                                { "id": 1226, "name": "Pantalones chinos" },
                                { "id": 1227, "name": "Pantalones de pierna ancha" },
                                { "id": 1228, "name": "Pantalones de pierna estrecha" },
                                { "id": 1229, "name": "Pantalones capri" },
                                { "id": 1230, "name": "Pantalones cortos" },
                                { "id": 1231, "name": "Pantalones de cintura alta" },
                                { "id": 1232, "name": "Pantalones de cintura baja" },
                                // ... más subcategorías de Pantalones
                            ]
                        },
                        {
                            "id": 123,
                            "name": "Trajes",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 1231, "name": "Trajes de vestir" },
                                { "id": 1232, "name": "Trajes casuales" },
                                { "id": 1233, "name": "Trajes de lino" },
                                { "id": 1234, "name": "Trajes de lana" },
                                { "id": 1235, "name": "Trajes de algodón" },
                                // ... más subcategorías de Trajes
                            ]
                        },
                        {
                            "id": 124,
                            "name": "Sudaderas",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 1241, "name": "Sudaderas con capucha" },
                                { "id": 1242, "name": "Sudaderas sin capucha" },
                                { "id": 1243, "name": "Sudaderas de algodón" },
                                { "id": 1244, "name": "Sudaderas de lana" },
                                { "id": 1245, "name": "Sudaderas de poliéster" },
                                // ... más subcategorías de Sudaderas
                            ]
                        },
                        {
                            "id": 125,
                            "name": "Chaquetas",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 1251, "name": "Chaquetas de cuero" },
                                { "id": 1252, "name": "Chaquetas de denim" },
                                { "id": 1253, "name": "Chaquetas de abrigo" },
                                { "id": 1254, "name": "Chaquetas de lluvia" },
                                { "id": 1255, "name": "Chaquetas deportivas" },
                                // ... más subcategorías de Chaquetas
                            ]
                        },
                        {
                            "id": 126,
                            "name": "Calzado",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 1261, "name": "Zapatos de vestir" },
                                { "id": 1262, "name": "Zapatos casuales" },
                                { "id": 1263, "name": "Zapatillas deportivas" },
                                { "id": 1264, "name": "Botas" },
                                { "id": 1265, "name": "Sandalias" },
                                // ... más subcategorías de Calzado
                            ]
                        },
                        {
                            "id": 127,
                            "name": "Accesorios",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 1271, "name": "Cinturones" },
                                { "id": 1272, "name": "Corbatas" },
                                { "id": 1273, "name": "Pañuelos" },
                                { "id": 1274, "name": "Gafas de sol" },
                                { "id": 1275, "name": "Sombreros" },
                                // ... más subcategorías de Accesorios
                            ]
                        },
                        {
                            "id": 128,
                            "name": "Ropa Interior",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 1281, "name": "Calzoncillos" },
                                { "id": 1282, "name": "Boxers" },
                                { "id": 1283, "name": "Pijamas" },
                                { "id": 1284, "name": "Batas" },
                                { "id": 1285, "name": "Calcetines" },
                                // ... más subcategorías de Ropa Interior
                            ]
                        }
                        // ... más subcategorías de Hombre
                    ]
                },
                {
                    "id": 13,
                    "name": "Niños",
                    "subcategory": [
                        {
                            id: 0,
                            name: "Seleccionar categoría", // Opción disabled sin value
                            disabled: true, // Añadir el atributo disabled
                            subcategory: [],
                        },
                        {
                            "id": 131,
                            "name": "Ropa",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 1311, "name": "Camisas" },
                                { "id": 1312, "name": "Pantalones" },
                                { "id": 1313, "name": "Vestidos" },
                                { "id": 1314, "name": "Sudaderas" },
                                { "id": 1315, "name": "Chaquetas" },
                                { "id": 1316, "name": "Jerseys" },
                                { "id": 1317, "name": "Pantalones Cortos" },
                                { "id": 1318, "name": "Faldas" },
                                { "id": 1319, "name": "Trajes de baño" },
                                // ... más subcategorías de Ropa
                            ]
                        },
                        {
                            "id": 132,
                            "name": "Calzado",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 1321, "name": "Zapatillas" },
                                { "id": 1322, "name": "Sandalias" },
                                { "id": 1323, "name": "Botas" },
                                { "id": 1324, "name": "Zapatos" },
                                // ... más subcategorías de Calzado
                            ]
                        },
                        {
                            "id": 133,
                            "name": "Accesorios",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 1331, "name": "Gorros" },
                                { "id": 1332, "name": "Guantes" },
                                { "id": 1333, "name": "Bufandas" },
                                { "id": 1334, "name": "Mochilas" },
                                { "id": 1335, "name": "Gafas de sol" },
                                // ... más subcategorías de Accesorios
                            ]
                        },
                        {
                            "id": 134,
                            "name": "Juguetes",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 1341, "name": "Peluches" },
                                { "id": 1342, "name": "Coches" },
                                { "id": 1343, "name": "Muñecas" },
                                { "id": 1344, "name": "Juegos de mesa" },
                                { "id": 1345, "name": "Construcciones" },
                                { "id": 1346, "name": "Libros" },
                                { "id": 1347, "name": "Videojuegos" },
                                // ... más subcategorías de Juguetes
                            ]
                        }
                        // ... más subcategorías de Niños
                    ]
                }
            ],
        },
        {
            id: 2,
            name: 'Electrónicos',
            subcategory: [
                {
                    id: 0,
                    name: "Seleccionar categoría", // Opción disabled sin value
                    disabled: true, // Añadir el atributo disabled
                    subcategory: [],
                },
                {
                    "id": 21,
                    "name": "Computadoras",
                    "subcategory": [
                        {
                            id: 0,
                            name: "Seleccionar categoría", // Opción disabled sin value
                            disabled: true, // Añadir el atributo disabled
                            subcategory: [],
                        },
                        {
                            "id": 211,
                            "name": "Portátiles",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 2111, "name": "Ultrabooks" },
                                { "id": 2112, "name": "Gaming" },
                                { "id": 2113, "name": "Profesionales" },
                                { "id": 2114, "name": "Estudiantes" },
                                { "id": 2115, "name": "2 en 1" },
                                // ... más subcategorías de Portátiles
                            ]
                        },
                        {
                            "id": 212,
                            "name": "Escritorio",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 2121, "name": "Todo en uno" },
                                { "id": 2122, "name": "Torre" },
                                { "id": 2123, "name": "Gaming" },
                                { "id": 2124, "name": "Profesionales" },
                                // ... más subcategorías de Escritorio
                            ]
                        },
                        {
                            "id": 213,
                            "name": "Componentes",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 2131, "name": "Procesadores" },
                                { "id": 2132, "name": "Placas base" },
                                { "id": 2133, "name": "Memoria RAM" },
                                { "id": 2134, "name": "Almacenamiento" },
                                { "id": 2135, "name": "Tarjetas Gráficas" },
                                { "id": 2136, "name": "Fuentes de alimentación" },
                                { "id": 2137, "name": "Disipadores" },
                                { "id": 2138, "name": "Gabinetes" },
                                // ... más subcategorías de Componentes
                            ]
                        },
                        {
                            "id": 214,
                            "name": "Periféricos",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 2141, "name": "Monitores" },
                                { "id": 2142, "name": "Teclados" },
                                { "id": 2143, "name": "Ratones" },
                                { "id": 2144, "name": "Impresoras" },
                                { "id": 2145, "name": "Audífonos" },
                                { "id": 2146, "name": "Altavoces" },
                                { "id": 2147, "name": "Webcams" },
                                { "id": 2148, "name": "Micrófonos" },
                                // ... más subcategorías de Periféricos
                            ]
                        },
                        {
                            "id": 215,
                            "name": "Software",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 2151, "name": "Sistemas operativos" },
                                { "id": 2152, "name": "Antivírus" },
                                { "id": 2153, "name": "Productividad" },
                                { "id": 2154, "name": "Diseño" },
                                { "id": 2155, "name": "Juegos" },
                                // ... más subcategorías de Software
                            ]
                        }
                        // ... más subcategorías de Computadoras
                    ]
                },
                {
                    "id": 22,
                    "name": "Smartphones",
                    "subcategory": [
                        {
                            id: 0,
                            name: "Seleccionar categoría", // Opción disabled sin value
                            disabled: true, // Añadir el atributo disabled
                            subcategory: [],
                        },
                        {
                            "id": 221,
                            "name": "Android",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 2211, "name": "Gama Alta" },
                                { "id": 2212, "name": "Gama Media" },
                                { "id": 2213, "name": "Gama Baja" },
                                { "id": 2214, "name": "Resistentes" },
                                { "id": 2215, "name": "Plegables" },
                                // ... más subcategorías de Android
                            ]
                        },
                        {
                            "id": 222,
                            "name": "iOS",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 2221, "name": "iPhone" },
                                { "id": 2222, "name": "iPad" },
                                // ... más subcategorías de iOS
                            ]
                        },
                        {
                            "id": 223,
                            "name": "Accesorios",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 2231, "name": "Fundas" },
                                { "id": 2232, "name": "Cargadores" },
                                { "id": 2233, "name": "Auriculares" },
                                { "id": 2234, "name": "Protectores de pantalla" },
                                { "id": 2235, "name": "Baterías externas" },
                                { "id": 2236, "name": "Parlantes Bluetooth" },
                                // ... más subcategorías de Accesorios
                            ]
                        }
                        // ... más subcategorías de Smartphones
                    ]
                },
                {
                    "id": 23,
                    "name": "Audio",
                    "subcategory": [
                        {
                            id: 0,
                            name: "Seleccionar categoría", // Opción disabled sin value
                            disabled: true, // Añadir el atributo disabled
                            subcategory: [],
                        },
                        {
                            "id": 231,
                            "name": "Auriculares",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 2311, "name": "Inalámbricos" },
                                { "id": 2312, "name": "Con cable" },
                                { "id": 2313, "name": "Diademas" },
                                { "id": 2314, "name": "Intrauditivos" },
                                { "id": 2315, "name": "Gaming" },
                                { "id": 2316, "name": "Cancelación de ruido" },
                                // ... más subcategorías de Auriculares
                            ]
                        },
                        {
                            "id": 232,
                            "name": "Altavoces",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 2321, "name": "Portátiles" },
                                { "id": 2322, "name": "De escritorio" },
                                { "id": 2323, "name": "Home Theater" },
                                { "id": 2324, "name": "Barra de sonido" },
                                { "id": 2325, "name": "Subwoofers" },
                                // ... más subcategorías de Altavoces
                            ]
                        },
                        {
                            "id": 233,
                            "name": "Reproductores",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 2331, "name": "Reproductores de música digital" },
                                { "id": 2332, "name": "Tocadiscos" },
                                { "id": 2333, "name": "Radios" },
                                // ... más subcategorías de Reproductores
                            ]
                        },
                        {
                            "id": 234,
                            "name": "Micrófonos",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 2341, "name": "Condensador" },
                                { "id": 2342, "name": "Dinámico" },
                                { "id": 2343, "name": "USB" },
                                { "id": 2344, "name": "De solapa" },
                                { "id": 2345, "name": "Gaming" },
                                // ... más subcategorías de Micrófonos
                            ]
                        }
                        // ... más subcategorías de Audio
                    ]
                }
            ],
        },
        {
            id: 3,
            name: 'Máscotas',
            subcategory: [
                {
                    id: 0,
                    name: "Seleccionar categoría", // Opción disabled sin value
                    disabled: true, // Añadir el atributo disabled
                    subcategory: [],
                },
                {
                    "id": 31,
                    "name": "Perros",
                    "subcategory": [
                        {
                            id: 0,
                            name: "Seleccionar categoría", // Opción disabled sin value
                            disabled: true, // Añadir el atributo disabled
                            subcategory: [],
                        },
                        {
                            "id": 311,
                            "name": "Comida",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 3111, "name": "Comida Seca" },
                                { "id": 3112, "name": "Comida Húmeda" },
                                { "id": 3113, "name": "Comida para Cachorros" },
                                { "id": 3114, "name": "Comida para Adultos" },
                                { "id": 3115, "name": "Comida para Razas Pequeñas" },
                                { "id": 3116, "name": "Comida para Razas Grandes" },
                                { "id": 3117, "name": "Comida para Perros Sensibles" },
                                { "id": 3118, "name": "Comida para Perros Activos" },
                                // ... más subcategorías de Comida
                            ]
                        },
                        {
                            "id": 322,
                            "name": "Accesorios",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 3221, "name": "Collares" },
                                { "id": 3222, "name": "Correas" },
                                { "id": 3223, "name": "Arneses" },
                                { "id": 3224, "name": "Juguetes" },
                                { "id": 3225, "name": "Camas" },
                                { "id": 3226, "name": "Comederos y Bebederos" },
                                { "id": 3227, "name": "Productos de Higiene" },
                                { "id": 3228, "name": "Ropa" },
                                // ... más subcategorías de Accesorios
                            ]
                        },
                        {
                            "id": 333,
                            "name": "Cuidado",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 3331, "name": "Champús y Acondicionadores" },
                                { "id": 3332, "name": "Cepillos" },
                                { "id": 3333, "name": "Cortaúñas" },
                                { "id": 3334, "name": "Productos Dentales" },
                                { "id": 3335, "name": "Remedios para Pulgas y Garrapatas" },
                                // ... más subcategorías de Cuidado
                            ]
                        },
                        {
                            "id": 334,
                            "name": "Entrenamiento",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 3341, "name": "Bocados" },
                                { "id": 3342, "name": "Clicker" },
                                { "id": 3343, "name": "Libros y Guías" },
                                { "id": 3344, "name": "Cursos Online" },
                                // ... más subcategorías de Entrenamiento
                            ]
                        }
                        // ... más subcategorías de Perros
                    ]
                },
                {
                    "id": 32,
                    "name": "Gatos",
                    "subcategory": [
                        {
                            id: 0,
                            name: "Seleccionar categoría", // Opción disabled sin value
                            disabled: true, // Añadir el atributo disabled
                            subcategory: [],
                        },
                        {
                            "id": 321,
                            "name": "Comida",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 3211, "name": "Comida Seca" },
                                { "id": 3212, "name": "Comida Húmeda" },
                                { "id": 3213, "name": "Comida para Gatitos" },
                                { "id": 3214, "name": "Comida para Adultos" },
                                { "id": 3215, "name": "Comida para Gatos Sensibles" },
                                { "id": 3216, "name": "Comida para Gatos con Pelo Largo" },
                                { "id": 3217, "name": "Comida para Gatos Esterilizados" },
                                // ... más subcategorías de Comida
                            ]
                        },
                        {
                            "id": 322,
                            "name": "Accesorios",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 3221, "name": "Rascadores" },
                                { "id": 3222, "name": "Juguetes" },
                                { "id": 3223, "name": "Camas" },
                                { "id": 3224, "name": "Comederos y Bebederos" },
                                { "id": 3225, "name": "Arneses y Correas" },
                                { "id": 3226, "name": "Transportines" },
                                { "id": 3227, "name": "Productos de Higiene" },
                                { "id": 3228, "name": "Arena para Gato" },
                                // ... más subcategorías de Accesorios
                            ]
                        },
                        {
                            "id": 323,
                            "name": "Cuidado",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 3231, "name": "Champús y Acondicionadores" },
                                { "id": 3232, "name": "Cepillos" },
                                { "id": 3233, "name": "Cortaúñas" },
                                { "id": 3234, "name": "Productos Dentales" },
                                { "id": 3235, "name": "Remedios para Pulgas y Garrapatas" },
                                // ... más subcategorías de Cuidado
                            ]
                        },
                        {
                            "id": 324,
                            "name": "Salud",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 3241, "name": "Vitaminas y Suplementos" },
                                { "id": 3242, "name": "Medicamentos para Gatos" },
                                // ... más subcategorías de Salud
                            ]
                        }
                        // ... más subcategorías de Gatos
                    ]
                },
            ],
        },
        {
            id: 4,
            name: 'Hogar',
            subcategory: [
                {
                    id: 0,
                    name: "Seleccionar categoría", // Opción disabled sin value
                    disabled: true, // Añadir el atributo disabled
                    subcategory: [],
                },
                {
                    "id": 41,
                    "name": "Electrodomésticos",
                    "subcategory": [
                        {
                            id: 0,
                            name: "Seleccionar categoría", // Opción disabled sin value
                            disabled: true, // Añadir el atributo disabled
                            subcategory: [],
                        },
                        {
                            "id": 411,
                            "name": "Refrigeración",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 4111, "name": "Neveras" },
                                { "id": 4112, "name": "Congeladores" },
                                { "id": 4113, "name": "Neveras Combinadas" },
                                { "id": 4114, "name": "Vinotecas" },
                                // ... más subcategorías de Refrigeración
                            ]
                        },
                        {
                            "id": 412,
                            "name": "Cocina",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 4121, "name": "Hornos" },
                                { "id": 4122, "name": "Placas de Inducción" },
                                { "id": 4123, "name": "Microondas" },
                                { "id": 4124, "name": "Campanas Extractoras" },
                                { "id": 4125, "name": "Cafeteras" },
                                { "id": 4126, "name": "Batidoras" },
                                { "id": 4127, "name": "Robot de Cocina" },
                                { "id": 4128, "name": "Tostadoras" },
                                { "id": 4129, "name": "Planchas de Asar" },
                                // ... más subcategorías de Cocina
                            ]
                        },
                        {
                            "id": 413,
                            "name": "Lavandería",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 4131, "name": "Lavadoras" },
                                { "id": 4132, "name": "Secadoras" },
                                { "id": 4133, "name": "Lavadoras Secadoras" },
                                { "id": 4134, "name": "Planchas de Ropa" },
                                { "id": 4135, "name": "Centrifugas" },
                                // ... más subcategorías de Lavandería
                            ]
                        },
                        {
                            "id": 414,
                            "name": "Limpieza",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 4141, "name": "Aspiradoras" },
                                { "id": 4142, "name": "Robots Aspiradores" },
                                { "id": 4143, "name": "Fregadoras" },
                                { "id": 4144, "name": "Limpiadoras a Vapor" },
                                // ... más subcategorías de Limpieza
                            ]
                        },
                        {
                            "id": 415,
                            "name": "Climatización",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 4151, "name": "Aire Acondicionado" },
                                { "id": 4152, "name": "Calefacción" },
                                { "id": 4153, "name": "Ventiladores" },
                                // ... más subcategorías de Climatización
                            ]
                        },
                        {
                            "id": 416,
                            "name": "Otros",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 4161, "name": "Secadores de Pelo" },
                                { "id": 4162, "name": "Planchas de Pelo" },
                                { "id": 4163, "name": "Depiladoras" },
                                { "id": 4164, "name": "Afeitadoras" },
                                { "id": 4165, "name": "Ventiladores" },
                                // ... más subcategorías de Otros
                            ]
                        }
                        // ... más subcategorías de Electrodomésticos
                    ]
                },
                {
                    "id": 42,
                    "name": "Muebles",
                    "subcategory": [
                        {
                            id: 0,
                            name: "Seleccionar categoría", // Opción disabled sin value
                            disabled: true, // Añadir el atributo disabled
                            subcategory: [],
                        },
                        {
                            "id": 421,
                            "name": "Salón",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 4211, "name": "Sofás" },
                                { "id": 4212, "name": "Sillones" },
                                { "id": 4213, "name": "Mesas de Centro" },
                                { "id": 4214, "name": "Muebles de TV" },
                                { "id": 4215, "name": "Librerías" },
                                { "id": 4216, "name": "Estanterías" },
                                // ... más subcategorías de Salón
                            ]
                        },
                        {
                            "id": 422,
                            "name": "Comedor",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 4221, "name": "Mesas de Comedor" },
                                { "id": 4222, "name": "Sillas" },
                                { "id": 4223, "name": "Buffets" },
                                { "id": 4224, "name": "Vitrinas" },
                                // ... más subcategorías de Comedor
                            ]
                        },
                        {
                            "id": 423,
                            "name": "Dormitorio",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 4231, "name": "Camas" },
                                { "id": 4232, "name": "Cabeceros" },
                                { "id": 4233, "name": "Mesitas de Noche" },
                                { "id": 4234, "name": "Armarios" },
                                { "id": 4235, "name": "Cómodas" },
                                { "id": 4236, "name": "Espejos" },
                                // ... más subcategorías de Dormitorio
                            ]
                        },
                        {
                            "id": 424,
                            "name": "Cocina",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 4241, "name": "Muebles de Cocina" },
                                { "id": 4242, "name": "Mesas de Cocina" },
                                { "id": 4243, "name": "Sillas de Cocina" },
                                // ... más subcategorías de Cocina
                            ]
                        },
                        {
                            "id": 425,
                            "name": "Baño",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 4251, "name": "Muebles de Baño" },
                                { "id": 4252, "name": "Espejos de Baño" },
                                { "id": 4253, "name": "Toalleros" },
                                // ... más subcategorías de Baño
                            ]
                        },
                        {
                            "id": 426,
                            "name": "Oficina",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 4261, "name": "Escritorios" },
                                { "id": 4262, "name": "Sillas de Oficina" },
                                { "id": 4263, "name": "Librerías de Oficina" },
                                { "id": 4264, "name": "Archivadores" },
                                // ... más subcategorías de Oficina
                            ]
                        },
                        {
                            "id": 427,
                            "name": "Jardín",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 4271, "name": "Muebles de Jardín" },
                                { "id": 4272, "name": "Sombrillas" },
                                { "id": 4273, "name": "Hamacas" },
                                // ... más subcategorías de Jardín
                            ]
                        },
                        {
                            "id": 428,
                            "name": "Decoración",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 4281, "name": "Alfombras" },
                                { "id": 4282, "name": "Cortinas" },
                                { "id": 4283, "name": "Cuadros" },
                                { "id": 4284, "name": "Esculturas" },
                                // ... más subcategorías de Decoración
                            ]
                        }
                        // ... más subcategorías de Muebles
                    ]
                },
                {
                    "id": 43,
                    "name": "Herramientas",
                    "subcategory": [
                        {
                            id: 0,
                            name: "Seleccionar categoría", // Opción disabled sin value
                            disabled: true, // Añadir el atributo disabled
                            subcategory: [],
                        },
                        {
                            "id": 431,
                            "name": "Manuales",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 4311, "name": "Destornilladores" },
                                { "id": 4312, "name": "Llaves" },
                                { "id": 4313, "name": "Martillos" },
                                { "id": 4314, "name": "Alicates" },
                                { "id": 4315, "name": "Taladros Manuales" },
                                { "id": 4316, "name": "Serruchos" },
                                { "id": 4317, "name": "Niveles" },
                                { "id": 4318, "name": "Cintas Métricas" },
                                // ... más subcategorías de Manuales
                            ]
                        },
                        {
                            "id": 432,
                            "name": "Eléctricas",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 4321, "name": "Taladros Eléctricos" },
                                { "id": 4322, "name": "Atornilladores" },
                                { "id": 4323, "name": "Amoladoras" },
                                { "id": 4324, "name": "Sierra Circular" },
                                { "id": 4325, "name": "Lijadoras" },
                                { "id": 4326, "name": "Cortadoras de Césped" },
                                { "id": 4327, "name": "Sopladores de Hojas" },
                                // ... más subcategorías de Eléctricas
                            ]
                        },
                        {
                            "id": 433,
                            "name": "Jardinería",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 4331, "name": "Tijeras de Podar" },
                                { "id": 4332, "name": "Rastrillos" },
                                { "id": 4333, "name": "Palas" },
                                { "id": 4334, "name": "Azadas" },
                                { "id": 4335, "name": "Mangueras de Jardín" },
                                // ... más subcategorías de Jardinería
                            ]
                        },
                        {
                            "id": 434,
                            "name": "Construcción",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 4341, "name": "Niveles Láser" },
                                { "id": 4342, "name": "Taladros de Impacto" },
                                { "id": 4343, "name": "Martillos Demoledor" },
                                { "id": 4344, "name": "Hormigoneras" },
                                { "id": 4345, "name": "Andamios" },
                                // ... más subcategorías de Construcción
                            ]
                        },
                        {
                            "id": 435,
                            "name": "Accesorios",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 4351, "name": "Brocas" },
                                { "id": 4352, "name": "Tornillos" },
                                { "id": 4353, "name": "Clavos" },
                                { "id": 4354, "name": "Discos de Corte" },
                                { "id": 4355, "name": "Lijas" },
                                // ... más subcategorías de Accesorios
                            ]
                        }
                        // ... más subcategorías de Herramientas
                    ]
                }
            ],
        },
        {
            id: 5,
            name: 'Belleza y Cuidado Personal',
            subcategory: [
                {
                    id: 0,
                    name: "Seleccionar categoría", // Opción disabled sin value
                    disabled: true, // Añadir el atributo disabled
                    subcategory: [],
                },
                {
                    "id": 51,
                    "name": "Maquillaje",
                    "subcategory": [
                        {
                            id: 0,
                            name: "Seleccionar categoría", // Opción disabled sin value
                            disabled: true, // Añadir el atributo disabled
                            subcategory: [],
                        },
                        {
                            "id": 511,
                            "name": "Rostro",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 5111, "name": "Bases de Maquillaje" },
                                { "id": 5112, "name": "Correctores" },
                                { "id": 5113, "name": "Polvos Compactos" },
                                { "id": 5114, "name": "Polvos Sueltos" },
                                { "id": 5115, "name": "Rubores" },
                                { "id": 5116, "name": "Contornos" },
                                { "id": 5117, "name": "Iluminadores" },
                                // ... más subcategorías de Rostro
                            ]
                        },
                        {
                            "id": 512,
                            "name": "Ojos",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 5121, "name": "Sombras de Ojos" },
                                { "id": 5122, "name": "Delineadores" },
                                { "id": 5123, "name": "Máscara de Pestañas" },
                                { "id": 5124, "name": "Rímel" },
                                { "id": 5125, "name": "Lápices de Cejas" },
                                { "id": 5126, "name": "Sombras de Cejas" },
                                // ... más subcategorías de Ojos
                            ]
                        },
                        {
                            "id": 513,
                            "name": "Labios",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 5131, "name": "Labiales" },
                                { "id": 5132, "name": "Bálsamos Labiales" },
                                { "id": 5133, "name": "Delineadores de Labios" },
                                // ... más subcategorías de Labios
                            ]
                        },
                        {
                            "id": 514,
                            "name": "Uñas",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 5141, "name": "Esmaltes" },
                                { "id": 5142, "name": "Base para Esmalte" },
                                { "id": 5143, "name": "Top Coat" },
                                // ... más subcategorías de Uñas
                            ]
                        },
                        {
                            "id": 515,
                            "name": "Accesorios",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 5151, "name": "Brochas" },
                                { "id": 5152, "name": "Pinceles" },
                                { "id": 5153, "name": "Esponjas" },
                                { "id": 5154, "name": "Paleta de Maquillaje" },
                                // ... más subcategorías de Accesorios
                            ]
                        }
                        // ... más subcategorías de Maquillaje
                    ]
                },
                {
                    "id": 52,
                    "name": "Cabello",
                    "subcategory": [
                        {
                            id: 0,
                            name: "Seleccionar categoría", // Opción disabled sin value
                            disabled: true, // Añadir el atributo disabled
                            subcategory: [],
                        },
                        {
                            "id": 521,
                            "name": "Cuidado",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 5211, "name": "Champús" },
                                { "id": 5212, "name": "Acondicionadores" },
                                { "id": 5213, "name": "Mascarillas Capilares" },
                                { "id": 5214, "name": "Tratamientos para el Cabello" },
                                { "id": 5215, "name": "Aceites para el Cabello" },
                                // ... más subcategorías de Cuidado
                            ]
                        },
                        {
                            "id": 522,
                            "name": "Estilismo",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 5221, "name": "Secadores de Pelo" },
                                { "id": 5222, "name": "Planchas de Pelo" },
                                { "id": 5223, "name": "Rizadores" },
                                { "id": 5224, "name": "Cepillos" },
                                { "id": 5225, "name": "Accesorios para el Cabello" },
                                // ... más subcategorías de Estilismo
                            ]
                        },
                        {
                            "id": 523,
                            "name": "Coloración",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 5231, "name": "Tintes" },
                                { "id": 5232, "name": "Decolorantes" },
                                { "id": 5233, "name": "Tintes Naturales" },
                                // ... más subcategorías de Coloración
                            ]
                        },
                        {
                            "id": 524,
                            "name": "Productos para el Cabello",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 5241, "name": "Geles para el Cabello" },
                                { "id": 5242, "name": "Espumas para el Cabello" },
                                { "id": 5243, "name": "Lacas para el Cabello" },
                                { "id": 5244, "name": "Cera para el Cabello" },
                                // ... más subcategorías de Productos para el Cabello
                            ]
                        }
                        // ... más subcategorías de Cabello
                    ]
                },
                {
                    "id": 53,
                    "name": "Cuerpo",
                    "subcategory": [
                        {
                            id: 0,
                            name: "Seleccionar categoría", // Opción disabled sin value
                            disabled: true, // Añadir el atributo disabled
                            subcategory: [],
                        },
                        {
                            "id": 531,
                            "name": "Cuidado Corporal",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 5311, "name": "Cremas Hidratantes" },
                                { "id": 5312, "name": "Lociones Corporales" },
                                { "id": 5313, "name": "Jabones" },
                                { "id": 5314, "name": "Exfoliantes" },
                                { "id": 5315, "name": "Aceites Corporales" },
                                { "id": 5316, "name": "Cremas Antiedad" },
                                { "id": 5317, "name": "Cremas para Estrías" },
                                // ... más subcategorías de Cuidado Corporal
                            ]
                        },
                        {
                            "id": 532,
                            "name": "Afeitado",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 5321, "name": "Espumas de Afeitar" },
                                { "id": 5322, "name": "Geles de Afeitar" },
                                { "id": 5323, "name": "Afeitadoras" },
                                { "id": 5324, "name": "Cuchillas de Afeitar" },
                                { "id": 5325, "name": "Aftershave" },
                                // ... más subcategorías de Afeitado
                            ]
                        },
                        {
                            "id": 533,
                            "name": "Manos y Pies",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 5331, "name": "Cremas de Manos" },
                                { "id": 5332, "name": "Cremas de Pies" },
                                { "id": 5333, "name": "Lima de Uñas" },
                                { "id": 5334, "name": "Cortaúñas" },
                                // ... más subcategorías de Manos y Pies
                            ]
                        },
                        {
                            "id": 534,
                            "name": "Baño",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 5341, "name": "Geles de Ducha" },
                                { "id": 5342, "name": "Sales de Baño" },
                                { "id": 5343, "name": "Bombas de Baño" },
                                { "id": 5344, "name": "Esponjas de Baño" },
                                // ... más subcategorías de Baño
                            ]
                        },
                        {
                            "id": 535,
                            "name": "Depilación",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 5351, "name": "Cera Depilatoria" },
                                { "id": 5352, "name": "Depiladoras Eléctricas" },
                                { "id": 5353, "name": "Crema Depilatoria" },
                                // ... más subcategorías de Depilación
                            ]
                        }
                        // ... más subcategorías de Cuerpo
                    ]
                }
            ],
        },
        {
            id: 6,
            name: 'Automóviles y Motos',
            subcategory: [
                {
                    id: 0,
                    name: "Seleccionar categoría", // Opción disabled sin value
                    disabled: true, // Añadir el atributo disabled
                    subcategory: [],
                },
                {
                    "id": 61,
                    "name": "Accesorios",
                    "subcategory": [
                        {
                            id: 0,
                            name: "Seleccionar categoría", // Opción disabled sin value
                            disabled: true, // Añadir el atributo disabled
                            subcategory: [],
                        },
                        {
                            "id": 611,
                            "name": "Seguridad",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 6111, "name": "Cascos" },
                                { "id": 6112, "name": "Guantes" },
                                { "id": 6113, "name": "Chaquetas" },
                                { "id": 6114, "name": "Pantalones" },
                                { "id": 6115, "name": "Botas" },
                                { "id": 6116, "name": "Protectores" },
                                { "id": 6117, "name": "Alarmas" },
                                { "id": 6118, "name": "Candados" }
                            ]
                        },
                        {
                            "id": 612,
                            "name": "Comodidad",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 6121, "name": "Asientos" },
                                { "id": 6122, "name": "Respaldos" },
                                { "id": 6123, "name": "Parabrisas" },
                                { "id": 6124, "name": "Manubrios" },
                                { "id": 6125, "name": "Puños" },
                                { "id": 6126, "name": "Espejos" },
                                { "id": 6127, "name": "Portaequipajes" },
                                { "id": 6128, "name": "Bolsas" },
                                { "id": 6129, "name": "Cubre-cadenas" },
                                { "id": 6130, "name": "Calienta-manubrios" }
                            ]
                        },
                        {
                            "id": 613,
                            "name": "Mantenimiento",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 6131, "name": "Aceite" },
                                { "id": 6132, "name": "Filtros" },
                                { "id": 6133, "name": "Bujías" },
                                { "id": 6134, "name": "Llantas" },
                                { "id": 6135, "name": "Herramientas" },
                                { "id": 6136, "name": "Limpiadores" }
                            ]
                        },
                        {
                            "id": 614,
                            "name": "Electrónica",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 6141, "name": "Navegadores GPS" },
                                { "id": 6142, "name": "Intercomunicadores" },
                                { "id": 6143, "name": "Cámaras" },
                                { "id": 6144, "name": "Cargadores" },
                                { "id": 6145, "name": "Sistemas de Audio" }
                            ]
                        },
                        {
                            "id": 615,
                            "name": "Estética",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 6151, "name": "Pegatinas" },
                                { "id": 6152, "name": "Faros LED" },
                                { "id": 6153, "name": "Escapes" },
                                { "id": 6154, "name": "Cubre-radiadores" },
                                { "id": 6155, "name": "Defensas" }
                            ]
                        }
                    ]
                },
                {
                    "id": 62,
                    "name": "Repuestos",
                    "subcategory": [
                        {
                            id: 0,
                            name: "Seleccionar categoría", // Opción disabled sin value
                            disabled: true, // Añadir el atributo disabled
                            subcategory: [],
                        },
                        {
                            "id": 621,
                            "name": "Motor",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 6211, "name": "Pistones" },
                                { "id": 6212, "name": "Bielas" },
                                { "id": 6213, "name": "Cigüeñales" },
                                { "id": 6214, "name": "Arbol de Levas" },
                                { "id": 6215, "name": "Válvulas" },
                                { "id": 6216, "name": "Juntas" },
                                { "id": 6217, "name": "Retenes" },
                                { "id": 6218, "name": "Correas de Distribución" },
                                { "id": 6219, "name": "Cadena de Distribución" },
                                { "id": 6220, "name": "Embrague" },
                                { "id": 6221, "name": "Caja de Cambios" }
                            ]
                        },
                        {
                            "id": 622,
                            "name": "Chasis y Suspensión",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 6221, "name": "Horquillas" },
                                { "id": 6222, "name": "Amortiguadores" },
                                { "id": 6223, "name": "Rodamientos" },
                                { "id": 6224, "name": "Bujes" },
                                { "id": 6225, "name": "Ejes" },
                                { "id": 6226, "name": "Bastidores" },
                                { "id": 6227, "name": "Brazo de Oscilación" },
                                { "id": 6228, "name": "Guardabarros" }
                            ]
                        },
                        {
                            "id": 623,
                            "name": "Frenos",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 6231, "name": "Discos de Freno" },
                                { "id": 6232, "name": "Pastillas de Freno" },
                                { "id": 6233, "name": "Bombines de Freno" },
                                { "id": 6234, "name": "Latiguillos de Freno" },
                                { "id": 6235, "name": "Manetas de Freno" },
                                { "id": 6236, "name": "Pinzas de Freno" }
                            ]
                        },
                        {
                            "id": 624,
                            "name": "Ruedas y Neumáticos",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 6241, "name": "Llantas" },
                                { "id": 6242, "name": "Neumáticos" },
                                { "id": 6243, "name": "Cámaras de Aire" },
                                { "id": 6244, "name": "Válvulas" }
                            ]
                        },
                        {
                            "id": 625,
                            "name": "Iluminación",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 6251, "name": "Faros" },
                                { "id": 6252, "name": "Intermitentes" },
                                { "id": 6253, "name": "Luces Traseras" },
                                { "id": 6254, "name": "Bombillas" }
                            ]
                        },
                        {
                            "id": 626,
                            "name": "Carrocería",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 6261, "name": "Carenados" },
                                { "id": 6262, "name": "Asientos" },
                                { "id": 6263, "name": "Depósitos de Combustible" },
                                { "id": 6264, "name": "Tapa de Motor" }
                            ]
                        },
                        {
                            "id": 627,
                            "name": "Electricidad",
                            "subcategory": [
                                {
                                    id: 0,
                                    name: "Seleccionar categoría", // Opción disabled sin value
                                    disabled: true, // Añadir el atributo disabled
                                    subcategory: [],
                                },
                                { "id": 6271, "name": "Batería" },
                                { "id": 6272, "name": "Cableado" },
                                { "id": 6273, "name": "Relés" },
                                { "id": 6274, "name": "Fusibles" },
                                { "id": 6275, "name": "Encendido Electrónico" }
                            ]
                        }
                    ]
                }
            ],
        },
    ];

    const colors = [
        { value: '', label: 'Elige un color', disabled: true },
        { value: 'bg-[#27ae60]', label: 'Verde' },
        { value: 'bg-[#f56565]', label: 'Rojo' },
        { value: 'bg-[#edd95a]', label: 'Amarillo' },
        { value: 'bg-[#4ade80]', label: 'Turquesa' },
        { value: 'bg-[#8b5cf6]', label: 'Morado' },
        { value: 'bg-[#1e40af]', label: 'Azul' },
        { value: 'bg-[#a855f7]', label: 'Lila' },
        { value: 'bg-[#f97316]', label: 'Naranja' },
        { value: 'bg-[#3b82f6]', label: 'Azul Cielo' },
        { value: 'bg-[#10b981]', label: 'Verde Agua' },
        { value: 'bg-[#ef4444]', label: 'Rojo Oscuro' },
        { value: 'bg-[#eab308]', label: 'Amarillo Oscuro' },
        { value: 'bg-[#7835d7]', label: 'Morado Oscuro' },
    ];

    const size = [
        { value: '', label: 'Elige un tamaño', disabled: true },
        { value: 'xs', label: 'Extra Small (XS)' },
        { value: 's', label: 'Small (S)' },
        { value: 'm', label: 'Medium (M)' },
        { value: 'l', label: 'Large (L)' },
        { value: 'xl', label: 'Extra Large (XL)' },
        { value: 'xxl', label: 'Extra Extra Large (XXL)' },
        { value: 'xxxl', label: 'Extra Extra Extra Large (XXXL)' },
    ];

    const options = [
        { value: '', label: 'Seleccionar Estado', disabled: true },
        { value: 'active', label: 'Activo' },
        { value: 'inactive', label: 'Inactivo' },
    ];

    const validate = (values) => {

        let errors = {};
        if (!values.inputs.parent.status) {
            errors['inputs.parent.status'] = 'El estado es requerido';
        }
        if (!values.inputs.parent.title) {
            errors['inputs.parent.title'] = 'El título es requerido';
        } else if (values.inputs.parent.title.length > 80) {
            errors['inputs.parent.title'] = 'El título no puede exceder los 80 caracteres';
        }
        if (!values.inputs.parent.description) {
            errors['inputs.parent.description'] = 'La descripción es requerida';
        }
        if (!values.inputs.parent.image) {
            errors['inputs.parent.image'] = 'El campo image es requerido';
        }

        if (selectedFile) {
            if (selectedFile.size > 1048576) {
                errors['inputs.parent.image'] = 'El archivo no debe exceder 1MB';
            } else if (!['jpeg', 'jpg', 'webp', 'png'].includes(selectedFile.name.split('.').pop().toLowerCase())) {
                errors['inputs.parent.image'] = 'El archivo debe ser .jpeg, .jpg, .webp o .png';
            }
        }

        values.inputs.child.forEach((input, index) => {
            if (!input.status) {
                errors[`inputs.child.${index}.status`] = 'El estado es requerido';
              }
            if (!input.color) {
                errors[`inputs.child.${index}.color`] = 'El color es requerido';
            }
            if (!input.size) {
                errors[`inputs.child.${index}.size`] = 'El tamaño es requerido';
            }
            if (!input.price) {
                errors[`inputs.child.${index}.price`] = 'El precio es requerido';
            }
            if (!input.stock) {
                errors[`inputs.child.${index}.stock`] = 'El stock es requerido';
            }
            if (!input.image) {
                errors[`inputs.child.${index}.image`] = 'El campo image es requerido';
            }
            if (selectedFile2) {
                if (selectedFile2.size > 1048576) {
                    errors[`inputs.child.${index}.image`] = 'El archivo no debe exceder 1MB';
                } else if (!['jpeg', 'jpg', 'webp', 'png'].includes(selectedFile2.name.split('.').pop().toLowerCase())) {
                    errors[`inputs.child.${index}.image`] = 'El archivo debe ser .jpeg, .jpg, .webp o .png';
                }
            }

        });

        return errors;
    };

    useEffect(() => {
    
        if (categoriesList) {
            const { subcategory3 } = categoriesList;
            // Find the category and its subcategories in one pass
            const categoryData = categories.find(cat => cat.name === subcategory3);
            if (categoryData) {
                setCategoryName(categoryData.name);
                setSelectedCategory(categoryData.id)
            }
        }
    }, [categoriesList, categories]);

    return (
        <div>
            {isLoadingForm && (
                <div className="loader-overlay">
                    <div className="loader"></div>
                </div>
            )}
            {!isLoadingForm && (
                <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    validate={validate}
                >
                    {({ values, errors, setFieldValue }) => (
                        <Form className="mb-5 pb-5">
                            <h3 className="text-lg text-center font-bold text-slate-800 font-oxanium">
                                Objetivo: Llenar datos del producto y variantes
                            </h3>
                            {showMissingCategory && (
                                <div className="text-red-500 text-xs mt-1 text-center">
                                    ¡Debe seleccionar las categorías en sus 4 niveles!
                                </div>
                            )}
                            <SelectInput
                                label={`Estado`}
                                name={`inputs.parent.status`}
                                options={options}
                            />
                            {errors[`inputs.parent.status`] && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors[`inputs.parent.status`]}
                                </div>
                            )}
                            <NestedSelectInput
                                label={`Categoría Principal`}
                                name={`inputs.parent.category`}
                                options={[
                                    ...categories.map((cat) => ({ value: cat.id, label: cat.name }))
                                ]}
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                            />

                            {selectedCategory && (
                                <NestedSelectInput
                                    label={`Categoría Nivel 2`}
                                    name={`inputs.parent.subcategory`}
                                    options={subcategories.map((subcat) => ({ value: subcat.id, label: subcat.name }))}
                                    value={selectedSubcategory}
                                    onChange={handleSubcategoryChange}
                                />
                            )}

                            {selectedSubcategory && (
                                <NestedSelectInput
                                    label={`Categoría Nivel 3`}
                                    name={`inputs.parent.subcategory2`}
                                    options={finalSubcategories.map((finalSubcat) => ({ value: finalSubcat.id, label: finalSubcat.name }))}
                                    value={selectedFinalSubcategory}
                                    onChange={handleFinalSubcategoryChange}
                                />
                            )}

                            {selectedFinalSubcategory && (
                                <NestedSelectInput
                                    label={`Categoría Nivel 4`}
                                    name={`inputs.parent.subcategory3`}
                                    options={fourthSubcategories.map((fourthSubcat) => ({ value: fourthSubcat.id, label: fourthSubcat.name }))}
                                    value={selectedFourthSubcategory}
                                    onChange={handleFourthSubcategoryChange}
                                />
                            )}

                            <Input
                                name={`inputs.parent.title`}
                                label={`Titulo`}
                            />
                            {errors[`inputs.parent.title`] && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors[`inputs.parent.title`]}
                                </div>
                            )}
                            <TextArea
                                initialValue={formData?.[0]?.description ?? ''}
                                name={`inputs.parent.description`}
                                label={`Descripción`}
                                onEditorChange={(content) => {
                                    setFieldValue(`inputs.parent.description`, content);
                                }}
                            />
                            {errors[`inputs.parent.description`] && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors[`inputs.parent.description`]}
                                </div>
                            )}
                            {values.inputs.parent.image && (
                                <p>
                                    Actual: <a href={values.inputs.parent.image}>{values.inputs.parent.image}</a>
                                </p>
                            )}
                            <FileInput
                                name={`inputs.parent.image`}
                                helpText="Tamaño máximo del archivo: 1MB (jpeg, jpg, webp, png) 1920x1100px"
                                onFileChange={handleFileChange}
                            />
                            {errors[`inputs.parent.image`] && (
                                <div className="text-red-500 text-xs mt-1">
                                    {errors[`inputs.parent.image`]}
                                </div>
                            )}
                            <hr className="m-3" />
                            <span className='mb-4'>Variantes</span>
                            <FieldArray name="inputs.child">
                                {({ insert, remove, push }) => (
                                    <>
                                        {values.inputs.child.map((input, index) => (

                                            <div key={index}>
                                                <SelectInput
                                                    label={`Estado`}
                                                    name={`inputs.child.${index}.status`}
                                                    options={options}
                                                />
                                                {errors[`inputs.child.${index}.color`] && (
                                                    <div className="text-red-500 text-xs mt-1">
                                                        {errors[`inputs.child.${index}.status`]}
                                                    </div>
                                                )}
                                                <SelectInput
                                                    label={`Color ${index + 1}`}
                                                    name={`inputs.child.${index}.color`}
                                                    options={colors}
                                                />
                                                {errors[`inputs.child.${index}.color`] && (
                                                    <div className="text-red-500 text-xs mt-1">
                                                        {errors[`inputs.child.${index}.color`]}
                                                    </div>
                                                )}
                                                <SelectInput
                                                    label={`Talla ${index + 1}`}
                                                    name={`inputs.child.${index}.size`}
                                                    options={size}
                                                />
                                                {errors[`inputs.child.${index}.size`] && (
                                                    <div className="text-red-500 text-xs mt-1">
                                                        {errors[`inputs.child.${index}.size`]}
                                                    </div>
                                                )}
                                                <DecimalInput
                                                    name={`inputs.child.${index}.price`}
                                                    label={`Precio ${index + 1}`}
                                                />
                                                {errors[`inputs.child.${index}.price`] && (
                                                    <div className="text-red-500 text-xs mt-1">
                                                        {errors[`inputs.child.${index}.price`]}
                                                    </div>
                                                )}
                                                <NumberInput
                                                    name={`inputs.child.${index}.stock`}
                                                    label={`Stock ${index + 1}`}
                                                />
                                                {errors[`inputs.child.${index}.stock`] && (
                                                    <div className="text-red-500 text-xs mt-1">
                                                        {errors[`inputs.child.${index}.stock`]}
                                                    </div>
                                                )}
                                                {input.image && (
                                                    <p>
                                                        Actual: <a href={input.image}>{input.image}</a>
                                                    </p>
                                                )}
                                                <FileInput
                                                    label={`Imagen`}
                                                    name={`inputs.child.${index}.image`}
                                                    helpText="Tamaño máximo del archivo: 1MB (jpeg, jpg, webp, png) 1920x1100px"
                                                    onFileChange={handleFileChange2}
                                                />
                                                {errors[`inputs.child.${index}.image`] && (
                                                    <div className="text-red-500 text-xs mt-1">
                                                        {errors[`inputs.child.${index}.image`]}
                                                    </div>
                                                )}

                                                <button type="button" onClick={() => {
                                                    push({ status:'', product: '', color: '', size: '', price: '', stock: '', image: '' });

                                                }} className="mt-2">
                                                    <span className="text-green-500">+</span> Añadir
                                                </button>

                                                {index > 0 && formData.length > 0 (
                                                    <button
                                                        type="button"
                                                        className="ml-2 float-right"
                                                        onClick={remove(index)}
                                                    >
                                                        <span className="text-red-500">- Eliminar</span>
                                                    </button>
                                                )}
                                            </div>
                                        ))}

                                    </>
                                )}
                            </FieldArray>
                            <hr className="m-3" />
                            <FixedBar sendingForm={sendingForm} progress={progress} />
                            <Buttons
                                ariaLabel="botón del formulario"
                                isLoading={sendingForm}
                                type={showMissingCategory || sendingForm || Object.keys(errors).length > 0 ? 'button' : 'submit'}
                                className={`text-oxanium bg-indigo-900 text-white hover:bg-black-100 hover:text-indigo-900 shadow-md px-6 font-medium font-oxanium rounded-none uppercase text-[11px] float-end ${Object.keys(errors).length > 0 ? "disabled" : ""
                                    }`}
                                disabled={showMissingCategory || sendingForm || Object.keys(errors).length > 0}
                                text="Guardar"
                                color="#fff"
                                size="md"
                            />
                        </Form>
                    )}
                </Formik>
            )}

        </div>
    );
};

export default MyForm;