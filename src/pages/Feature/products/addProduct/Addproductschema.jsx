import * as yup from "yup";
export const addproductPageschema = yup
.object()
.shape({
  tax: yup.object({
    _id: yup.string().required("Enter Tax"),
  }),
  units: yup.object({
    _id: yup.string().required("Choose Unit"),
  }),
  category: yup.object({
    _id: yup.string().required("Choose Category"),
  }),

  type: yup.string().typeError("Choose Any Type"),
  name: yup.string().required("Enter Product Name"),
  // sku: yup.number().typeError("SKU Must Be a Number"),

  sellingPrice: yup
    .number()
    .typeError("Enter a valid Selling Price")
    .test(
      "valid-number",
      "Enter a valid Selling Price",
      (value) => typeof value === "number" && !/[eE+-]/.test(value?.toString())
    )
    .positive("Selling Price must be a positive number")
    .when("purchasePrice", (purchasePrice, schema) =>
      purchasePrice
        ? schema.moreThan(purchasePrice, "Selling Price must be greater than the Purchase Price")
        : schema
    )
    .required("Selling Price is required"),

  purchasePrice: yup
    .number()
    .typeError("Enter a valid Purchase Price")
    .test(
      "valid-number",
      "Enter a valid Purchase Price",
      (value) => typeof value === "number" && !/[eE+-]/.test(value?.toString())
    )
    .positive("Purchase Price must be a positive number")
    .required("Purchase Price is required"),

    halfSkitQty: yup
    .number()
    .typeError("Enter Half Skit Quantity")
    .integer("Half Skit Quantity must be an integer")
    .positive("Must be a positive number")
    .nullable(),

  halfSkitPrice: yup
    .number()
    .typeError("Enter Half Skit Price")
    .test(
      "valid-half-price",
      "Enter a valid Half Skit Price",
      (value) =>
        value === undefined || (typeof value === "number" && !/[eE+-]/.test(value?.toString()))
    )
    .positive("Must be a positive number")
    .nullable(),

  fullSkitQty: yup
    .number()
    .typeError("Enter Full Skit Quantity")
    .integer("Full Skit Quantity must be an integer")
    .positive("Must be a positive number")
    .nullable(),

  fullSkitPrice: yup
    .number()
    .typeError("Enter Full Skit Price")
    .test(
      "valid-full-price",
      "Enter a valid Full Skit Price",
      (value) =>
        value === undefined || (typeof value === "number" && !/[eE+-]/.test(value?.toString()))
    )
    .positive("Must be a positive number")
    .nullable(),
  
  alertQuantity: yup
    .number()
    .typeError("Enter Alert quantity")
    .positive("Alert Quantity Must Be a Positive Number")
    .integer("Alert Quantity Must Be a Integer"),
})
.required();