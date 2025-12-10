import { Breadcrumbs, Link, Typography } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';

export default function BreadCrumbsPage() {
    return (
        <div className="w-100 mb-3">
            <Breadcrumbs aria-label="breadcrumb">
                <Link
                    underline="hover"
                    sx={{ display: 'flex', alignItems: 'center' }}
                    color="inherit"
                    href="/"
                >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Home
                </Link>
                <Typography
                    sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}
                >
                    Produtos
                </Typography>
            </Breadcrumbs>
        </div>
    )
}