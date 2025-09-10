import BrandsList from "./BrandsList";
import CategoriesList from "./CategoriesList";
import OthersList from "./OthersList";

export default function FiltersContainer() {
    return (
        <div style={{width:'20%'}}>
            <div className="filtros-bg" style={{borderRadius: '6px', border: '1px solid #c1c1c1'}}>
                <div className="filtros">
                    <h4 className='text-left mb-3 title-filtros'>Filtros</h4>
                    <div className="filtro">
                        <CategoriesList />
                        <BrandsList />
                        <OthersList />
                        <div style={{padding: '10px'}}>
                            <button type='button' className='refreshFillters'>Atualizar Filtros</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}