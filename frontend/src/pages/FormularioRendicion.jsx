const FormularioRendicion = ({ distribuidor, cuit }) => {
    return (
        <div>
            <h1>Formulario de rendición</h1>
            <form>
                <label htmlFor="fecha">Fecha de Transferencia: </label>
                <input type="date" id="fecha" name="fecha" required />
                <br />

                <label htmlFor="distribuidor">Distribuidor: {distribuidor}</label>
                <br />
                <label htmlFor="cuit">CUIT: {cuit}</label>
                <br />

                <label htmlFor="periodo_rendicion">
                    Período de Rendición de la Tasa de Fiscalización y Control (1):
                </label>
                <input type="month" id="periodo_rendicion" name="periodo_rendicion" required />
                <br />

                <label htmlFor="total_tasa_letras">
                    Total Tasa de Fiscalización y Control: Pesos (en letras):
                </label>
                <input
                    type="text"
                    id="total_tasa_letras"
                    name="total_tasa_letras"
                    placeholder="Mil doscientos treinta y cuatro"
                    required
                />
                <label htmlFor="total_tasa">
                    ($ <input type="number" id="total_tasa" name="total_tasa" placeholder="1234" required /> )
                </label>

                <label htmlFor="total_transferencia_letras">
                    Total Transferencia: Pesos (en letras):
                </label>
                <input
                    type="text"
                    id="total_transferencia_letras"
                    name="total_transferencia_letras"
                    placeholder="Mil doscientos treinta y cuatro"
                    required
                />
                <label htmlFor="total_transferencia">
                    ($ <input type="number" id="total_transferencia" name="total_transferencia" placeholder="1234" required /> )
                </label>

                <br />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
};

export default FormularioRendicion;
