import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { LegalScreen } from '../../src/components/LegalScreen';
import { colors } from '../../src/theme/colors';

export default function TermsScreen() {
  return (
    <LegalScreen title="Términos">
      <Text style={styles.h1}>Términos de Servicio</Text>
      <Text style={styles.date}>Última actualización: Junio 2026</Text>

      <Text style={styles.h2}>Aceptación de los términos</Text>
      <Text style={styles.p}>
        Al descargar, instalar o usar Scout, aceptas estos términos de servicio. Si no estás de acuerdo,
        no utilices la aplicación.
      </Text>

      <Text style={styles.h2}>Licencia</Text>
      <Text style={styles.p}>
        Se te concede una licencia limitada, no exclusiva, intransferible y revocable para usar Scout
        en tus dispositivos personales para fines no comerciales. No puedes modificar, distribuir ni
        realizar ingeniería inversa de la aplicación.
      </Text>

      <Text style={styles.h2}>Suscripciones premium</Text>
      <Text style={styles.p}>
        Scout ofrece planes de suscripción premium (mensual, anual y vitalicio). Los pagos se procesan
        a través de la tienda de aplicaciones correspondiente (Google Play o App Store). Las
        suscripciones se renuevan automáticamente a menos que se cancelen al menos 24 horas antes del
        final del período actual. Puedes gestionar tus suscripciones desde los ajustes de tu cuenta en
        la tienda de aplicaciones.
      </Text>

      <Text style={styles.h2}>Uso aceptable</Text>
      <Text style={styles.p}>
        Aceptas usar Scout solo para fines legítimos. No debes:
      </Text>
      <Text style={styles.bullet}>• Usar Scout para diagnosticar condiciones médicas sin consultar a un profesional</Text>
      <Text style={styles.bullet}>• Modificar, descompilar o realizar ingeniería inversa de la aplicación</Text>
      <Text style={styles.bullet}>• Usar la aplicación para cualquier propósito ilegal o no autorizado</Text>
      <Text style={styles.bullet}>• Intentar eludir las funciones de seguridad o pago de la aplicación</Text>

      <Text style={styles.h2}>Propiedad intelectual</Text>
      <Text style={styles.p}>
        Todos los derechos de propiedad intelectual de Scout, incluyendo el código fuente, diseño, logotipos
        y marca, son propiedad de Uyobonus. No adquieres ningún derecho de propiedad sobre la aplicación.
      </Text>

      <Text style={styles.h2}>Limitación de responsabilidad</Text>
      <Text style={styles.p}>
        En la máxima medida permitida por la ley, Scout se proporciona "tal cual" sin garantías de ningún
        tipo. No seremos responsables por daños indirectos, incidentales o consecuentes derivados del uso
        de la aplicación.
      </Text>

      <Text style={styles.h2}>Terminación</Text>
      <Text style={styles.p}>
        Podemos suspender o terminar tu acceso a Scout si violas estos términos. Tras la terminación,
        debes dejar de usar la aplicación y eliminar todas las copias.
      </Text>

      <Text style={styles.h2}>Contacto</Text>
      <Text style={styles.p}>
        Para preguntas sobre estos términos, contáctanos en: scout@uyobonus.com
      </Text>
    </LegalScreen>
  );
}

const styles = StyleSheet.create({
  h1: { color: colors.primary, fontSize: 20, fontWeight: '700', marginBottom: 4, lineHeight: 28 },
  date: { color: colors.textTertiary, fontSize: 11, marginBottom: 16 },
  h2: { color: colors.text, fontSize: 15, fontWeight: '600', marginTop: 20, marginBottom: 6 },
  p: { color: colors.textSecondary, fontSize: 13, lineHeight: 20, marginBottom: 4 },
  bullet: { color: colors.textSecondary, fontSize: 13, lineHeight: 20, marginLeft: 8, marginBottom: 2 },
});
