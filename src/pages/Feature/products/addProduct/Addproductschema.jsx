import * as yup from "yup";
export const addproductPageschema = yup
.object()
.shape({
  // discountType: yup.object({
  //   id: yup.string().required("Choose Discount Type"),
  // }),
  // discountValue: yup
  //   .number()
  //   .typeError("Discount Value is Required")
  //   .when(
  //     ["discountType", "sellingPrice"],
  //     (discountType, sellingPrice, schema) => {
  //       if (discountType.text === "Percentage") {
  //         return schema.max(99, "Discount Value Must Be Less Than 100");
  //       } else if (discountType.text === "Fixed") {
  //         return schema.lessThan(
  //           sellingPrice,
  //           "Discount Value Must Be Less Than The Selling Price"
  //         );
  //       }
  //       return schema;
  //     }
  //   ),
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
  sku: yup.number().typeError("SKU Must Be a Number"),

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
  
  alertQuantity: yup
    .number()
    .typeError("Enter Alert quantity")
    .positive("Alert Quantity Must Be a Positive Number")
    .integer("Alert Quantity Must Be a Integer"),
})
.required();