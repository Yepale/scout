import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { LegalScreen } from '../../src/components/LegalScreen';
import { colors } from '../../src/theme/colors';

export default function DisclaimerScreen() {
  return (
    <LegalScreen title="Aviso Legal">
      <Text style={styles.h1}>Aviso Legal y Descargo de Responsabilidad</Text>

      <Text style={styles.h2}>Propósito</Text>
      <Text style={styles.p}>
        Scout es una herramienta de asistencia visual diseñada para ayudar a identificar posibles signos de
        garrapatas, pulgas, picaduras y parásitos externos en mascotas y personas. Scout es una aplicación
        informativa y educativa, NO un dispositivo médico.
      </Text>

      <Text style={styles.h2}>No es un diagnóstico médico</Text>
      <Text style={styles.p}>
        Scout NO proporciona diagnósticos médicos, tratamientos ni recomendaciones clínicas. Los resultados
        generados por la aplicación son indicativos y deben ser evaluados por un profesional de la salud
        veterinario o médico calificado. Nunca ignore el consejo médico profesional ni se demore en buscarlo
        debido a información proporcionada por Scout.
      </Text>

      <Text style={styles.h2}>Precisión</Text>
      <Text style={styles.p}>
        Si bien nos esforzamos por lograr la mayor precisión posible, Scout puede no detectar todas las
        amenazas potenciales o puede generar falsos positivos. La tecnología de reconocimiento visual tiene
        limitaciones y no debe utilizarse como único método de detección.
      </Text>

      <Text style={styles.h2}>Emergencias</Text>
      <Text style={styles.p}>
        Si usted o su mascota experimentan síntomas graves, reacciones alérgicas, dificultad para respirar,
        hinchazón severa o cualquier otra emergencia médica, busque atención médica inmediata llamando a
        los servicios de emergencia locales.
      </Text>

      <Text style={styles.h2}>Responsabilidad</Text>
      <Text style={styles.p}>
        El uso de Scout es bajo su propio riesgo. Los creadores, desarrolladores y colaboradores de Scout
        no asumen ninguna responsabilidad por cualquier pérdida, daño o perjuicio que surja directa o
        indirectamente del uso de esta aplicación.
      </Text>

      <Text style={styles.h2}>Público objetivo</Text>
      <Text style={styles.p}>
        Scout está dirigido a dueños de mascotas, padres, campistas, excursionistas y amantes de la naturaleza
        mayores de 18 años. Personas menores de edad deben utilizar la aplicación bajo la supervisión de un adulto.
      </Text>
    </LegalScreen>
  );
}

const styles = StyleSheet.create({
  h1: { color: colors.primary, fontSize: 20, fontWeight: '700', marginBottom: 20, lineHeight: 28 },
  h2: { color: colors.text, fontSize: 15, fontWeight: '600', marginTop: 20, marginBottom: 6 },
  p: { color: colors.textSecondary, fontSize: 13, lineHeight: 20, marginBottom: 4 },
});
