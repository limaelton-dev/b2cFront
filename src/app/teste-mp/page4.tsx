import { useState } from "react";

function Parent() {
    const [count, setCount] = useState(0);
    const [count2, setCount2] = useState(0);
  
    const handleClick = () => {
      console.log("clicou");
    };
  
    return (
      <>
        <Child onClick={handleClick} />
        <button onClick={() => setCount(c => c + 1)}>Incrementar</button>
        <p>Contador: {count}</p>
        <p>Contador2: {count2}</p>
      </>
    );
  }

  function Child({ onClick }: { onClick: () => void }) {
    return <button onClick={onClick}>Clicar</button>;
  }

  export default Parent;
  