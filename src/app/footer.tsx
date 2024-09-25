
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
                <div className="col-lg-3">
                    <h4>Newsletter</h4>
                    <p>Inscreva-se para receber nossas ofertas!</p>
                    <form action="url" method="POST" id="newsletter-form">
                        <div className="content-inp">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280 320-200v-80L480-520 160-720v80l320 200Z"/>
                            </svg>
                            <input type="text" name="email" placeholder="Digite seu email"/>
                        </div>
                        <button>
                            Inscrevra-se
                        </button>
                    </form>
                </div>
                <div className="copyright">
                    <hr/>
                    <p>©️ Coletek 2024.</p>
                </div>
            </div>
        </footer>
    );
}