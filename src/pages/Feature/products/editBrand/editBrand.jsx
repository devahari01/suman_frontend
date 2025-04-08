import React, { useState, useEffect, useContext } from "react";
import { DropIcon } from "../../../../common/imagepath";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { yupResolver } from "@hookform/resolvers/yup";
import { EditBrandContext } from "./editBrand.control";
import useFilePreview from "../hooks/useFilePreview";
import { warningToast } from "../../../../core/core-index";

const EditBrand = () => {
  const { addBrandSchema, brandDetail, setFileImage, onSubmit } =
    useContext(EditBrandContext);

  const {
    handleSubmit,
    control,
    setValue,
    trigger,
    resetField,
    watch,
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(addBrandSchema) });
  
  const [imgError, setImgError] = useState("");
  const file = watch("logo");
  const [filePreview] = useFilePreview(file, setImgError);
  const [img, setImg] = useState("");

  useEffect(() => {
    if (imgError) {
      warningToast(imgError);
      resetField("logo");
      setImgError("");
    }
  }, [imgError]);

  useEffect(() => {
    setValue("name", brandDetail?.name);
    setValue("slug", brandDetail?.slug);
    setImg(brandDetail?.logo);
  }, [brandDetail]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFile) => {
      setValue("logo", acceptedFile);
      setFileImage(acceptedFile);
    },
  });

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="content-page-header">
          <h5>Edit Brand</h5>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group-item border-0 pb-0 mb-0">
                  <div className="row">
                    <div className="col-lg-4 col-sm-12">
                      <div className="form-group">
                        <label>
                          Name <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="name"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <input
                                className="form-control"
                                value={value}
                                type="text"
                                placeholder="Enter Brand Name"
                                onChange={(val) => {
                                  onChange(val);
                                  trigger("name");
                                }}
                              />
                              {errors.name && (
                                <p className="text-danger">
                                  {errors.name.message}
                                </p>
                              )}
                            </>
                          )}
                          defaultValue=""
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-sm-12">
                      <div className="form-group">
                        <label>
                          Slug<span className="text-danger"> *</span>
                        </label>
                        <Controller
                          name="slug"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <input
                                className="form-control"
                                value={value}
                                type="text"
                                placeholder="Enter Slug"
                                maxLength={20}
                                onChange={(val) => {
                                  onChange(val);
                                  trigger("slug");
                                }}
                              />
                              {errors.slug && (
                                <p className="text-danger">
                                  {errors.slug.message}
                                </p>
                              )}
                            </>
                          )}
                          defaultValue=""
                        />
                      </div>
                    </div>
                    {/*<div className="col-lg-6 col-sm-12">
                      <div className="form-group mb-0 pb-0">
                        <label>Logo</label>
                        <div {...getRootProps()} className="form-group service-upload mb-0">
                          <input {...getInputProps()} />
                          <span>
                            <img src={DropIcon} alt="upload" />
                          </span>
                          <h6 className="drop-browse align-center">
                            Drop your files here or
                            <span className="text-primary ms-1">browse</span>
                          </h6>
                          <p className="text-muted">Maximum size: 50MB</p>
                        </div>
                        {!imgError && filePreview ? (
                          <img
                            src={filePreview}
                            className="uploaded-imgs"
                            style={{
                              display: "flex",
                              maxWidth: "200px",
                              maxHeight: "200px",
                            }}
                          />
                        ) : (
                          img && (
                            <img
                              src={img}
                              className="uploaded-imgs"
                              style={{
                                display: "flex",
                                maxWidth: "200px",
                                maxHeight: "200px",
                              }}
                            />
                          )
                        )}
                      </div>
                    </div>*/}
                  </div>
                </div>
                <div className="text-end">
                  <Link to="/brand" className="btn btn-primary cancel me-2">
                    Cancel
                  </Link>
                  <button className="btn btn-primary" type="submit">
                    Update Brand
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBrand;
