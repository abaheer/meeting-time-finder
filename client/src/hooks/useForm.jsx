import { useState } from "react";

export const useForm = (getFreshModelObject) => {
  const [values, setValues] = useState(getFreshModelObject());
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
    console.log(values);
  };

  const handleSliderChange = (name, value) => {
    setValues({
      ...values,
      [name]: value,
    });
    console.log({ values });
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    handleSliderChange,
  };
};
