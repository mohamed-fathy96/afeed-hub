import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { convertObjectIntoQueryParams } from "@app/lib/helpers/constants/helpers";
import {
  Button,
  Card,
  Drawer,
  ModalBody,
  ModalHeader,
  ModalLegacy,
  CardBody,
} from "@app/ui";
import ProductDetailsForm from "@app/components/form/product/ProductDetailsForm";
import {
  CategoryService,
  GlobalService,
  ProductService,
} from "@app/services/actions";
import { useToast } from "@app/helpers/hooks/use-toast";
import { routes } from "@app/lib/routes";
import SingleSelectDropdown from "@app/ui/SingleDropDown/SingleSelectDropdown";
import {
  ParamsUrl,
  ProductSort,
  ProductTypeFilter,
} from "@app/lib/types/product";
import { BulkAssign } from "./BulkAssign";
import { BulkStatus } from "./BulkStatus";
import { BulkSort } from "./BulkSort";
import RestrictedWrapper from "@app/routing/routingComponents/RestrictedWrapper";
import { Icon } from "@app/ui/Icon";
type BulkAction = "status" | "sort" | "assign";
const FilterSection: React.FC<{
  handleConfirmFilter?: (params: any) => void;
  params: ParamsUrl;
  setParams: any;
}> = ({ params, setParams }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [createProductModal, setCreateProductModal] = useState<boolean>(false);
  const [categroyList, setCategoryList] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedBulkAction, setSelectedBulkAction] = useState<BulkAction>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [storeList, setStoreList] = useState<any[]>([]);
  const [brandList, setBrandList] = useState<any[]>([]);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams({ ...params, searchKey: e.target.value, pageNumber: 1 });
  };

  const handleClickFilter = () => {
    const queryString = convertObjectIntoQueryParams(params);
    navigate({ search: queryString });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleClickFilter();
    }
  };
  const fetchCategoryList = async () => {
    try {
      const res = await CategoryService.getLightList();
      setCategoryList(res?.data ?? []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to get list");
    }
  };
  const getStoreList = async () => {
    const res = await GlobalService.getAllStores();
    setStoreList(res?.data ?? []);
  };
  const getBrandList = async () => {
    const res = await GlobalService.getAllBrands();
    setBrandList(res?.data ?? []);
  };
  useEffect(() => {
    getStoreList();
    getBrandList();
    fetchCategoryList();
  }, []);
  const submitForm = async (values: any) => {
    setIsLoading(true);
    try {
      const res = await ProductService.createProduct(values);
      if (res?.data?.productId) {
        toast.success(res?.data?.message ?? "Product Created successfully");
        navigate(routes.dashboard.products.edit(res?.data?.productId));
      }
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      toast.error(err?.response?.data?.message ?? "Failed to delete Product");
    }
  };
  const handleOpenModal = (status: BulkAction) => {
    setOpen(true);
    setSelectedBulkAction(status);
  };

  const sortOptions = [
    { id: ProductSort.Default, title: "Default" },
    { id: ProductSort.PriceAsc, title: "Price: Low to High" },
    { id: ProductSort.PriceDesc, title: "Price: High to Low" },
    { id: ProductSort.QuantityAsc, title: "Quantity: Low to High" },
    { id: ProductSort.QuantityDesc, title: "Quantity: High to Low" },
  ];
  const ProductTypeFilterOptions = [
    { id: String(ProductTypeFilter.All), title: "All" },
    { id: String(ProductTypeFilter.Normal), title: "Normal" },
    { id: String(ProductTypeFilter.ECard), title: "E-Card" },
  ];

  return (
    <Card className="bg-base-100 shadow-md">
      <CardBody>
        {/* Order Status Tabs */}
        <div className="col-span-12 flex mb-3 justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Icon icon="lucide:package" className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-gray-700 text-base">
              Products Management
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <details className="dropdown hidden">
              <summary className="btn btn-md btn-ghost border border-primary">
                🗂️ Bulk Actions
              </summary>
              <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-40 p-2 shadow-sm">
                <RestrictedWrapper
                  requiredPermissions="products"
                  action="bulk_upload"
                >
                  <li>
                    <button
                      onClick={() =>
                        navigate(routes.dashboard.products.bulkUpload)
                      }
                    >
                      <Icon icon="lucide:plus" />
                      Bulk Upload
                    </button>
                  </li>
                </RestrictedWrapper>
                <RestrictedWrapper
                  requiredPermissions="products"
                  action="bulk_sort"
                >
                  <li>
                    <button onClick={() => handleOpenModal("sort")}>
                      <Icon icon="lucide:arrow-down-0-1" />
                      Bulk Sort
                    </button>
                  </li>
                </RestrictedWrapper>
                <RestrictedWrapper
                  requiredPermissions="products"
                  action="bulk_status"
                >
                  <li>
                    <button onClick={() => handleOpenModal("status")}>
                      <Icon icon="lucide:toggle-left" />
                      Bulk Status
                    </button>
                  </li>
                </RestrictedWrapper>
                <RestrictedWrapper
                  requiredPermissions="products"
                  action="bulk_assign"
                >
                  <li>
                    <button onClick={() => handleOpenModal("assign")}>
                      <Icon icon="lucide:highlighter" />
                      Bulk Assign
                    </button>
                  </li>
                </RestrictedWrapper>
              </ul>
            </details>

            <Button
              size="md"
              color="primary"
              type="button"
              onClick={() => setCreateProductModal(true)}
            >
              <Icon icon="lucide:plus" />
              Create Product
            </Button>
          </div>
        </div>
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
          onKeyDown={handleKeyDown}
        >
          {/* Search Input */}
          <div className="relative col-span-1">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md pl-10 py-2 text-sm h-14"
              placeholder="Search by name"
              onChange={handleSearch}
              defaultValue={params?.searchKey}
            />
            <div className="absolute top-4 left-3 text-gray-500">🔍</div>
          </div>
          <div>
            <SingleSelectDropdown
              placeholder={"Select Category"}
              options={categroyList ?? []}
              optionName="name"
              optionValue="id"
              selectedValue={params.categoryId}
              handleChange={(_e: any, value) => {
                setParams({ ...params, categoryId: value?.id || "" });
              }}
            />
          </div>
          <div>
            <SingleSelectDropdown
              placeholder={"Sort by"}
              options={sortOptions}
              selectedValue={params.sort}
              handleChange={(_e: any, value) => {
                setParams({ ...params, sort: value?.id });
              }}
              optionName="title"
              optionValue="id"
            />
          </div>
          {storeList?.length > 0 ? (
            <div>
              <SingleSelectDropdown
                placeholder={"Select Store"}
                options={storeList}
                selectedValue={params.storeId}
                handleChange={(_e: any, value) => {
                  setParams({ ...params, storeId: value?.id });
                }}
                optionName="nameEn"
                optionValue="id"
              />
            </div>
          ) : null}

          {brandList?.length > 0 ? (
            <div>
              <SingleSelectDropdown
                placeholder={"Select Brand"}
                options={brandList}
                selectedValue={params.brandId}
                handleChange={(_e: any, value) => {
                  setParams({ ...params, brandId: value?.id });
                }}
                optionName="nameEn"
                optionValue="id"
              />
            </div>
          ) : null}
          <div>
            <SingleSelectDropdown
              placeholder={"Select Product type"}
              options={ProductTypeFilterOptions ?? []}
              optionName="title"
              optionValue="id"
              selectedValue={params.type}
              handleChange={(_e: any, value) => {
                setParams({ ...params, type: value?.id || -1 });
              }}
            />
          </div>
        </div>

        {/* Filter Button */}
        <div className="flex justify-end mt-4 gap-2">
          <Button
            color="ghost"
            variant="outline"
            size="md"
            onClick={() => {
              setParams({});
              navigate({ search: "" });
            }}
          >
            <Icon icon="lucide:x" />
            Clear Filter
          </Button>
          <Button
            color="primary"
            variant="outline"
            size="md"
            onClick={handleClickFilter}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <Icon icon="lucide:filter" />
            Apply Filter
          </Button>
        </div>
        <Drawer
          open={createProductModal}
          end
          onClickOverlay={() => setCreateProductModal(false)}
          sideClassName="z-[100]"
          side={
            <Card className="rounded-t-lg bg-base-100 h-full border-none overflow-y-auto m-3">
              <div className="bg-[#EDF0FE] p-4">
                <Button
                  size="sm"
                  type="button"
                  shape="circle"
                  className="absolute right-2 top-2"
                  aria-label="Close Drawer"
                  onClick={() => {
                    setCreateProductModal(false);
                  }}
                >
                  <Icon icon="lucide:x" />
                </Button>
                <h4 className="font-bold ">Create Product</h4>
              </div>
              <div>
                <ProductDetailsForm
                  onSubmit={submitForm}
                  isLoading={isLoading}
                  setOpen={setCreateProductModal}
                />
              </div>
            </Card>
          }
        />
        <ModalLegacy
          onClickBackdrop={() => {
            setOpen(false);
          }}
          open={open}
          role="dialog"
        >
          <form method="dialog">
            <Button
              size="sm"
              shape="circle"
              className="absolute right-2 top-2"
              aria-label="Close modal"
              onClick={() => {
                setOpen(false);
              }}
            >
              <Icon icon="lucide:x" />
            </Button>
          </form>
          <ModalHeader className="font-bold">
            Bulk Upload {selectedBulkAction}
          </ModalHeader>
          <ModalBody>
            {selectedBulkAction === "status" && (
              <BulkStatus setOpen={setOpen} />
            )}
            {selectedBulkAction === "sort" && <BulkSort setOpen={setOpen} />}
            {selectedBulkAction === "assign" && (
              <BulkAssign setOpen={setOpen} />
            )}
          </ModalBody>
        </ModalLegacy>
      </CardBody>
    </Card>
  );
};

export default FilterSection;
