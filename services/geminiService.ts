import { GoogleGenAI, Type } from "@google/genai";
import type { MealPlan, UserInfo } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("La variable de entorno API_KEY no está configurada");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    breakfast: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        recipe: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ['title', 'description', 'recipe']
    },
    lunch: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        recipe: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ['title', 'description', 'recipe']
    },
    dinner: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        recipe: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ['title', 'description', 'recipe']
    },
    snacks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING }
        },
        required: ['title', 'description']
      }
    },
    hydration: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ['title', 'recommendations']
    },
    healthAdvice: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['title', 'recommendations']
    }
  },
  required: ['breakfast', 'lunch', 'dinner', 'snacks', 'hydration', 'healthAdvice']
};

const systemInstruction = `Eres un nutricionista y chef experto, especializado en crear planes de bienestar para pacientes con condiciones médicas complejas. Tu objetivo es generar un plan de alimentación detallado y consejos de salud para un día, basado en el perfil del usuario y una lista estricta de alimentos permitidos. El plan debe ser seguro, atractivo y fácil de seguir. Responde ÚNICAMENTE con un objeto JSON válido que se adhiera al esquema proporcionado. El tono debe ser de apoyo, profesional y claro.`;

const createUserPrompt = (userInfo: UserInfo): string => `
Por favor, genera un plan de comidas completo y consejos de salud para un día para un paciente con los siguientes datos y condiciones:

**Datos del Paciente:**
- Nombre: ${userInfo.name}
- Sexo: ${userInfo.gender}
- Edad: ${userInfo.age} años
- Peso: ${userInfo.weight} kg
- Estatura: ${userInfo.height} cm

**Condiciones Médicas a Considerar:**
1.  **Colitis Ulcerosa (Brote Activo):** La dieta debe ser de bajo residuo, baja en fibra, blanda y de fácil digestión.
2.  **Hígado Graso Moderado y Dislipidemia:** La dieta debe ser estrictamente baja en grasas, especialmente saturadas y trans.
3.  **Obesidad y Grasa Visceral Alta:** El plan debe ser controlado en calorías.
4.  **Deshidratación:** Incluir abundantes recomendaciones de hidratación.
5.  **Uso de Prednisona:** Evitar azúcares añadidos y carbohidratos simples.

**CRÍTICO: Debes construir el plan de comidas utilizando ÚNICA Y EXCLUSIVAMENTE los siguientes alimentos de la 'Lista de Alimentos Seguros para Consumir'. No incluyas ningún otro ingrediente que no esté en esta lista.**

---

### **Lista de Alimentos Seguros para Consumir (Bajo Residuo + Baja Grasa)**

#### I. Proteínas Magras (Foco: Sin Grasa y Sin Piel)
| Alimento      | Forma de Consumo                                                              | Notas Clave                                                                                             |
|---------------|-------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| **Pollo / Pavo**  | Pechuga.                                                                      | SIEMPRE sin piel y sin grasa visible. Cocido, hervido, al vapor o a la plancha (con mínimo aceite).     |
| **Pescado Blanco**| Merluza, Corvina, Reineta.                                                    | De muy fácil digestión. Cocido, hervido o al vapor.                                                    |
| **Salmón**      | Salmón Chileno.                                                               | Con moderación (1-2 veces/semana) por su grasa total (aunque sea Omega-3). Cocido.                      |
| **Huevo**       | Huevo duro (cocido), pochado o revuelto (usando agua en lugar de aceite).       | Excelente proteína y muy fácil de digerir.                                                              |

#### II. Carbohidratos y Almidones (Foco: Bajo Residuo y Cocción Máxima)
| Alimento      | Forma de Consumo                                                              | Notas Clave                                                                                             |
|---------------|-------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| **Arroz**       | Arroz blanco.                                                                 | BIEN COCIDO. Evitar arroz integral.                                                                     |
| **Papa**        | Puré o trozos cocidos.                                                        | SIEMPRE pelada y cocida a fondo. Evitar frituras.                                                       |
| **Chuño**       | Papilla con leche descremada.                                                 | Almidón puro, sin residuo. Requiere remojo y cocción a fondo.                                         |
| **Yuca (Mandioca)** | Sopa o puré.                                                                | SIEMPRE pelada y cocida a fondo (olla a presión es la mejor opción).                                   |
| **Fideos**      | Fideos de sémola o arroz (incluyendo cabello de ángel).                         | BIEN COCIDOS. Evitar fideos integrales.                                                                 |
| **Pan**         | Pan de molde blanco, Pan tostado, Galletas de agua.                           | Debe ser blanco, refinado y tostado (evitar semillas o granos).                                         |
| **Sémola**      | En sopas o purés (papilla).                                                   | Excelente carbohidrato de fácil digestión.                                                              |

#### III. Vegetales y Frutas (Foco: Cero Fibra Dura e Irritantes)
| Alimento      | Forma de Consumo                                                              | Notas Clave                                                                                             |
|---------------|-------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| **Zanahoria**   | Cocida a fondo y pelada.                                                      | Ideal en purés o sopas.                                                                                 |
| **Calabacín (Zapallito Italiano)** | Cocido, pelado y sin semillas.                                | De muy fácil digestión.                                                                                 |
| **Zapallo (Calabaza)** | Puré o en sopas.                                                        | SIEMPRE pelado y cocido a fondo.                                                                        |
| **Plátano (Banana)** | Fruta.                                                                  | Maduro. Fruta de bajo residuo muy recomendada.                                                          |
| **Manzana**     | Puré de manzana o manzana asada/cocida (sin cáscara).                         | Debe eliminar la cáscara.                                                                               |
| **Palta (Aguacate)** | Fruta/Grasa.                                                              | Con estricta moderación (1-2 rodajas finas) por su contenido de grasa.                                |

#### IV. Lácteos y Líquidos
| Alimento      | Forma de Consumo                                                              | Notas Clave                                                                                             |
|---------------|-------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| **Lácteos**     | Leche descremada, yogur natural descremado (sin trozos).                      | Priorizar descremados (baja grasa). Si hay intolerancia, usar deslactosados.                           |
| **Líquidos**    | Agua, Caldos de pollo/verduras (colados y desgrasados), Infusiones (Manzanilla, Menta, Anís). | Crucial para la hidratación.                                                                          |
| **Postres**     | Gelatina sin azúcar.                                                          | Excelente fuente de hidratación, sin grasa ni azúcar.                                                   |

#### V. Condimentos (Foco: No Picantes ni Irritantes)
| Alimento      | Forma de Consumo                                                              | Notas Clave                                                                                             |
|---------------|-------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| **Cúrcuma**     | Polvo.                                                                        | Recomendado por sus propiedades antiinflamatorias.                                                     |
| **Orégano / Tomillo** | Seco y en polvo.                                                      | Usar en moderación.                                                                                     |
| **Pimentón (Páprika)** | Polvo (no picante).                                                     | Usar solo el polvo.                                                                                     |
| **Sal**         | Moderada.                                                                     | Para mejorar el sabor.                                                                                  |

---

**Solicitud:**
Con base en la lista anterior, proporciona un plan estructurado con:
- Desayuno
- Almuerzo
- Cena
- Dos Colaciones
- Plan de Hidratación
- **Consejos de Bienestar:** Incluye 2-3 recomendaciones de actividad física de bajo impacto (caminatas suaves, estiramientos) y un consejo de estilo de vida.

Para cada comida, proporciona una receta sencilla y atractiva utilizando solo los ingredientes permitidos.
`;


export const generateMealPlan = async (userInfo: UserInfo): Promise<MealPlan> => {
  try {
    const userPrompt = createUserPrompt(userInfo);
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userPrompt,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            temperature: 0.8,
        }
    });

    const jsonText = response.text.trim();
    const mealPlan: MealPlan = JSON.parse(jsonText);
    return mealPlan;
  } catch (error) {
    console.error("Error al generar el plan de comidas:", error);
    if (error instanceof Error) {
        throw new Error(`Falló la generación del plan de comidas desde la IA: ${error.message}`);
    }
    throw new Error("Ocurrió un error desconocido al generar el plan de comidas.");
  }
};