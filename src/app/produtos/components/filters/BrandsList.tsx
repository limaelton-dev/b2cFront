import { Accordion, AccordionDetails, AccordionSummary, Typography, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { fetchBrands } from "../../../services/brand";
import { useEffect, useState } from "react";

const getBrands = async () => {
    try {
        const dataBrands = await fetchBrands();
        return dataBrands.content;
    } catch (e) {
        console.log('deu pau: ', e)
    }
}

export default function BrandsList() {
    const [brands, setBrands] = useState([]);
    const loadBrands = async () => {
        try {
            const brands = await getBrands();
            setBrands(brands);
        } catch (error) {
            console.log('Deu algum erro: ', error);
            setBrands([]);
        }
    };

    useEffect(() => {
        loadBrands()
    }, [])


    return (
        <div>
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                >
                    <Typography sx={{fontWeight: 'bold'}} component="span">Marcas</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormGroup>
                        {Array.isArray(brands) && brands.length > 0 ? (
                            brands.map((brand) => (
                                <FormControlLabel 
                                    key={brand.id} 
                                    control={
                                        <Checkbox 
                                            // onChange={(event) => handleCheckboxChangeFab(event, f.brand?.name)} 
                                            // checked={fabSett.includes(f.brand?.name)} 
                                            size='small' 
                                        />
                                    } 
                                    label={brand.name} 
                                />
                            ))
                        ) : (
                            <Typography variant="body2">Carregando marcas...</Typography>
                        )}
                    </FormGroup>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}