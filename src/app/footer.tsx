import Image from 'next/image';
import LogoColetek from './assets/img/logo_coletek.png';

export default function Footer() {
    return (
        <footer>
            <div className="container d-flex flex-wrap">
                <div className="col-lg-3">
                    <div className="logo-footer">
                        <Image
                                src={LogoColetek}
                                alt="Logo Coletek"
                                unoptimized={true}
                            />
                    </div>
                    <h4>Siga-nos nas<br/>redes sociais!</h4>
                    <ul>
                        <li></li>
                    </ul>
                </div>
                <div className="col-lg-3">
                    <h4>Institucional</h4>
                    <ul>
                        <li>
                            <a href="">Quem somos</a>
                        </li>
                        <li>
                            <a href="">Blog</a>
                        </li>
                        <li>
                            <a href="">Localização</a>
                        </li>
                        <li>
                            <a href="">Trabalhe conosco</a>
                        </li>
                    </ul>
                </div>
                <div className="col-lg-3">
                    <h4>Dúvidas</h4>
                    <ul>
                        <li>
                            <a href="">Política de privacidade</a>
                        </li>
                        <li>
                            <a href="">Política de entrega</a>
                        </li>
                        <li>
                            <a href="">Termos e condições</a>
                        </li>
                        <li>
                            <a href="">Central de atendimento</a>
                        </li>
                    </ul>
                </div>
                <div className="copyright">
                    <hr/>
                    <p>©️ Coletek 2024.</p>
                </div>
            </div>
        </footer>
    );
}