import { Card, CardBody } from "@app/ui/Card";
import { useEffect, useState } from "react";
import { Category } from "@app/lib/types/category";
import { Icon } from "@iconify/react";
import { Button, SectionHeader } from "@app/ui";
import CategoryForm from "@app/components/form/category/CategoryForm";
import { useAppDispatch, useAppSelector } from "@app/lib/hooks/useStore";
import { getCategoryList } from "@app/store/category/CategorySelector";
import { setCategoryList } from "@app/store/category/CategorySlice";
import { CategoryService } from "@app/services/actions";
import { useNavigate } from "react-router-dom";

interface CategoryWithChildren extends Category {
  children?: CategoryWithChildren[];
  hasChildren?: boolean;
  isLoading?: boolean;
  isExpanded?: boolean;
}

const CategoryExplorer = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedCategoryData, setSelectedCategoryData] = useState<any>({});
  const [isLoadingCategoryData, setIsLoadingCategoryData] = useState(false);
  const categoryList = useAppSelector((state) => getCategoryList({ state }));

  const dispatch = useAppDispatch();

  // Function to build category tree from flat list
  const buildCategoryTree = (
    allCategories: Category[]
  ): CategoryWithChildren[] => {
    const categoryMap = new Map<number, CategoryWithChildren>();
    const rootCategories: CategoryWithChildren[] = [];

    // First pass: create map of all categories
    allCategories.forEach((category) => {
      categoryMap.set(category.id, {
        ...category,
        children: [],
        isLoading: false,
        hasChildren: true, // Parent categories always have children
        isExpanded: false,
      });
    });

    // Second pass: build tree structure
    allCategories.forEach((category) => {
      const categoryWithChildren = categoryMap.get(category.id)!;

      if (
        category.parentCategoryId &&
        categoryMap.has(category.parentCategoryId)
      ) {
        // This is a child category
        const parent = categoryMap.get(category.parentCategoryId)!;
        parent.children!.push(categoryWithChildren);
      } else {
        // This is a root category
        rootCategories.push(categoryWithChildren);
      }
    });

    return rootCategories;
  };

  // Function to load children for a specific category
  const loadCategoryChildren = async (categoryId: number) => {
    try {
      // Set loading state for this category
      setCategories((prevCategories) =>
        updateCategoryInTree(prevCategories, categoryId, { isLoading: true })
      );

      // Call API to get children for this specific category ID
      const response = await CategoryService.getChildrenCategories(categoryId);
      // The API returns an Axios response object with data property
      const childCategories = response?.data || [];

      // Transform children to include hasChildren flag and other properties
      // Child categories from API may have hasChildren: true/false
      const childrenWithFlags = childCategories.map((child: Category) => ({
        ...child,
        children: [],
        isLoading: false,
        isExpanded: false,
        hasChildren: child.hasChildren || false, // Child categories may or may not have children
      }));

      // Update the category with its children
      setCategories((prevCategories) => {
        const updated = updateCategoryInTree(prevCategories, categoryId, {
          children: childrenWithFlags,
          isLoading: false,
          isExpanded: true,
        });
        return updated;
      });
    } catch (error) {
      // Reset loading state on error
      setCategories((prevCategories) =>
        updateCategoryInTree(prevCategories, categoryId, { isLoading: false })
      );
    }
  };

  // Helper function to update a category in the tree
  const updateCategoryInTree = (
    categories: CategoryWithChildren[],
    categoryId: number,
    updates: Partial<CategoryWithChildren>
  ): CategoryWithChildren[] => {
    return categories.map((category) => {
      if (category.id === categoryId) {
        return { ...category, ...updates };
      }
      if (category.children) {
        return {
          ...category,
          children: updateCategoryInTree(
            category.children,
            categoryId,
            updates
          ),
        };
      }
      return category;
    });
  };

  // Function to fetch category data by ID
  const fetchCategoryData = async (categoryId: number) => {
    setIsLoadingCategoryData(true);
    try {
      const res = await CategoryService.getByCategoryId(categoryId);
      setSelectedCategoryData(res.data);
    } catch (err: any) {
      setSelectedCategoryData({});
    } finally {
      setIsLoadingCategoryData(false);
    }
  };

  // Function to handle category selection
  const handleCategorySelect = async (category: CategoryWithChildren) => {
    setSelectedCategoryId(category.id);
    await fetchCategoryData(category.id);
  };

  // Function to handle category expansion
  const handleCategoryExpand = async (category: CategoryWithChildren) => {
    // If category has children but no children are loaded yet, load them
    if (category.hasChildren && (category.children?.length ?? 0) === 0) {
      await loadCategoryChildren(category.id);
    } else {
      // Just toggle expansion state
      setCategories((prevCategories) =>
        updateCategoryInTree(prevCategories, category.id, {
          isExpanded: !category.isExpanded,
        })
      );
    }
  };

  // Function to render category tree recursively
  const renderCategoryTree = (
    categoryList: CategoryWithChildren[],
    level: number = 0
  ) => {
    console.log(
      `Rendering level ${level} with ${categoryList.length} categories:`,
      categoryList.map((c) => ({
        id: c.id,
        title: c.title,
        hasChildren: c.hasChildren,
        childrenLength: c.children?.length || 0,
        isExpanded: c.isExpanded,
      }))
    );

    return categoryList?.map((category) => (
      <li key={category.id} className="relative w-auto overflow-y-auto">
        {category.hasChildren ? (
          <details open={category.isExpanded} className="group">
            <summary
              className={`flex after:hidden items-center gap-3 p-2 rounded-lg hover:bg-base-300 transition-all duration-200 cursor-pointer group-hover:shadow-sm ${
                selectedCategoryId === category.id
                  ? "bg-primary/10 border border-primary/20 p-2"
                  : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleCategoryExpand(category);
              }}
              onDoubleClick={(e) => {
                e.preventDefault();
                handleCategorySelect(category);
              }}
            >
              <div className="flex items-center gap-2 flex-1">
                {category.isLoading ? (
                  <div className="loading loading-spinner loading-xs text-primary" />
                ) : category.hasChildren ? (
                  <>
                    <Icon
                      icon="lucide:plus"
                      className={`w-4 h-4 transition-transform duration-200 text-primary ${
                        category.isExpanded ? "hidden" : "block"
                      }`}
                    />
                    <Icon
                      icon="lucide:minus"
                      className={`w-4 h-4 transition-transform duration-200 text-primary ${
                        category.isExpanded ? "block" : "hidden"
                      }`}
                    />
                  </>
                ) : null}
                <Icon icon="lucide:boxes" className="w-5 h-5 text-warning" />
                <span className="font-medium text-base-content group-hover:text-primary text-base transition-colors duration-200">
                  {category.title || category.id}
                </span>
              </div>
              {category.isFeaturedCategory && (
                <div className="badge badge-primary badge-sm">
                  <Icon icon="lucide:star" className="w-3 h-3" />
                  Featured
                </div>
              )}
            </summary>
            <ul className="ml-6 mt-2 space-y-1 border-l-2 border-base-300 pl-4">
              {category.isExpanded &&
                renderCategoryTree(category.children || [], level + 1)}
            </ul>
          </details>
        ) : (
          <a
            className={`flex items-center gap-3 rounded-lg hover:bg-base-300 transition-all duration-200 cursor-pointer group hover:shadow-sm ${
              selectedCategoryId === category.id
                ? "bg-primary/10 border border-primary/20"
                : ""
            }`}
            onClick={() => handleCategorySelect(category)}
          >
            <div className="flex items-center gap-2 flex-1">
              <Icon icon="lucide:package" className="w-5 h-5 text-info" />
              <span className="text-base-content group-hover:text-primary transition-colors duration-200 text-base">
                {category.title}
              </span>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {category.isBestSellerCategory && (
                <div className="badge badge-success badge-xs">
                  <Icon icon="lucide:trending-up" className="w-3 h-3" />
                  Best
                </div>
              )}
              {category.isFeaturedCategory && (
                <div className="badge badge-primary badge-xs">
                  <Icon icon="lucide:star" className="w-3 h-3" />
                </div>
              )}
            </div>
          </a>
        )}
      </li>
    ));
  };

  useEffect(() => {
    setLoading(true);
    dispatch(setCategoryList({}));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (categoryList.length > 0) {
      setCategories(buildCategoryTree(categoryList));
    }
  }, [categoryList]);

  return (
    <Card className="p-6 bg-base-100">
      <CardBody className="bg-transparent">
        <SectionHeader
          title="Category Explorer"
          description="Browse and navigate through categories"
          type="primary"
          icon="lucide:telescope"
        />
        <div className="grid grid-cols-12 gap-4">
          <Card className="bg-base-100 max-h-svh sticky top-0 rounded-xl border border-base-300 shadow-sm overflow-hidden col-span-4">
            <CardBody className="p-4 bg-base-100 overflow-y-auto">
              <ul className="menu menu-lg bg-transparent space-y-1">
                {loading ? (
                  <li>
                    <div className="flex items-center gap-3 p-4">
                      <div className="loading loading-spinner loading-sm text-primary" />
                      <span className="text-base-content/70">
                        Loading categories...
                      </span>
                    </div>
                  </li>
                ) : categories.length > 0 ? (
                  renderCategoryTree(categories)
                ) : (
                  <li>
                    <div className="flex items-center gap-3 p-4 text-center">
                      <Icon
                        icon="lucide:folder-x"
                        className="w-5 h-5 text-base-content/40"
                      />
                      <span className="text-base-content/60">
                        No categories found
                      </span>
                    </div>
                  </li>
                )}
              </ul>
            </CardBody>
          </Card>
          <div className="col-span-8 h-full overflow-y-auto">
            <Card className="bg-base-100 shadow-sm mb-4">
              <CardBody className="p-4">
                {selectedCategoryId ? (
                  isLoadingCategoryData ? (
                    <div className="flex items-center justify-center p-8">
                      <div className="loading loading-spinner loading-lg text-primary" />
                      <span className="ml-2 text-base-content/70">
                        Loading category details...
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <SectionHeader
                          title={selectedCategoryData?.title}
                          description={
                            selectedCategoryData?.description ||
                            `Explore the products in ${selectedCategoryData?.title} category `
                          }
                          type="success"
                          icon="lucide:package"
                          iconClassName="text-success"
                        />
                        <Button
                          variant="outline"
                          onClick={() => {
                            navigate(
                              `/products?categoryId=${selectedCategoryId}`
                            );
                          }}
                          color="primary"
                        >
                          Show All Products
                        </Button>
                      </div>
                      <CategoryForm
                        data={selectedCategoryData}
                        id={selectedCategoryId}
                        fetchData={() => fetchCategoryData(selectedCategoryId)}
                      />
                    </>
                  )
                ) : (
                  <div className="flex items-center justify-center p-8 text-center">
                    <div className="text-base-content/60">
                      <Icon
                        icon="lucide:mouse-pointer-click"
                        className="w-8 h-8 mx-auto mb-2"
                      />
                      <p>
                        Select a category to view details: double click for
                        categories with children
                      </p>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default CategoryExplorer;
