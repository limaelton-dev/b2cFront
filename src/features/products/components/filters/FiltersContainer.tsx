import { Brand } from "@/api/brands/types/brand";
import { Category } from "@/api/categories/types/category";
import { Filters } from "@/types/filters";
import BrandsList from "./BrandsList";
import CategoriesList from "./CategoriesList";
import OthersList from "./OthersList";

export interface FiltersContainerProps {
    categories: Category[];
    brands: Brand[];
    filters: Filters;
    setFilters: (filters: Filters) => void;
}

export default function FiltersContainer({ categories, brands, filters, setFilters }: FiltersContainerProps) {
    const handleCategoriesChange = (newCategories: string[]) => {
        setFilters({
            ...filters,
            categories: newCategories
        });
    };

    const handleBrandsChange = (newBrands: string[]) => {
        setFilters({
            ...filters,
            brands: newBrands
        });
    };

    return (
        <div style={{width:'20%'}}>
            <div className="filtros-bg" style={{borderRadius: '6px', border: '1px solid #c1c1c1'}}>
                <div className="filtros">
                    <h4 className='text-left mb-3 title-filtros'>Filtros</h4>
                    <div className="filtro">
                        <CategoriesList categories={categories} filters={filters.categories} setFilters={handleCategoriesChange} />
                        <BrandsList brands={brands} filters={filters.brands} setFilters={handleBrandsChange} />
                        <OthersList filters={filters} setFilters={setFilters} />
                        <div style={{padding: '10px'}}>
                            <button 
                                type='button' 
                                className='refreshFillters'
                                onClick={() => setFilters({ categories: [], brands: [], term: '' })}
                            >
                                Limpar Filtros
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}