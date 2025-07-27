import React, { useContext, useState } from "react";
import { Controller } from "react-hook-form";
import { AddBrandContext } from "./AddBrand.control";
import useFilePreview from "../hooks/useFilePreview";

const AddBrand = () => {
  const {
    SubmitBrandForm,
    handleSubmit,
    watch,
    control,
    trigger,
    register,
    formState: { errors },
  } = useContext(AddBrandContext);

  const [imgError, setImgError] = useState("");
  const file = watch("image");
  const [filePreview] = useFilePreview(file, setImgError);

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <h5>Add Brand</h5>
        <form onSubmit={handleSubmit(SubmitBrandForm)}>
          <div className="form-group">
            <label>
              Name <span className="text-danger">*</span>
            </label>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field: { value, onChange } }) => (
                <>
                  <input
                    className="form-control"
                    value={value}
                    type="text"
                    placeholder="Enter Name"
                    onChange={(val) => {
                      onChange(val);
                      trigger("name");
                    }}
                  />
                  {errors.name && <p className="text-danger">{errors.name.message}</p>}
                </>
              )}
            />
          </div>
          {/* <div className="form-group">
            <label>
              Slug <span className="text-danger">*</span>
            </label>
            <Controller
              name="slug"
              control={control}
              defaultValue=""
              render={({ field: { value, onChange } }) => (
                <>
                  <input
                    className="form-control"
                    value={value}
                    type="text"
                    placeholder="Enter Slug"
                    onChange={(val) => {
                      onChange(val);
                      trigger("slug");
                    }}
                  />
                  {errors.slug && <p className="text-danger">{errors.slug.message}</p>}
                </>
              )}
            />
          </div> */}
          {/*<div className="form-group">
            <label>Image</label>
            <Controller
              name="image"
              control={control}
              render={({ field: { value, onChange } }) => (
                <input
                  type="file"
                  onChange={(e) => {
                    onChange(e.target.files);
                    trigger("image");
                  }}
                />
              )}
            />
            {!imgError && filePreview && <img src={filePreview} alt="Preview" />}
          </div>*/}
          <button type="submit" className="btn btn-primary">Add Brand</button>
        </form>
      </div>
    </div>
  );
};

export default AddBrand;
