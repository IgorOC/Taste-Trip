"use server";

import { Resend } from "resend";


// Configuração do Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export interface TripData {
  id: string;
  destination: string;
  origin: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  userName: string;
}

export interface User {
  email: string;
  name?: string;
}

export interface NewsletterContent {
  title: string;
  tips: string[];
}

// Templates de email
const getWelcomeEmailTemplate = (userName: string): string => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #14b8a6, #0f766e); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; }
        .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .button { display: inline-block; background: #14b8a6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌟 Bem-vindo ao Taste & Trip!</h1>
        </div>
        <div class="content">
            <h2>Olá, ${userName}!</h2>
            <p>É um prazer ter você conosco! 🎉</p>
            <p>Agora você pode:</p>
            <ul>
                <li>✈️ Criar roteiros personalizados com IA</li>
                <li>🍽️ Descobrir a gastronomia local</li>
                <li>🌤️ Ver informações climáticas</li>
                <li>💰 Gerenciar seus orçamentos de viagem</li>
            </ul>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/planner" class="button">Criar Minha Primeira Viagem</a>
            <p>Qualquer dúvida, estamos aqui para ajudar!</p>
        </div>
        <div class="footer">
            <p>Taste & Trip - Planeje suas viagens com inteligência artificial</p>
        </div>
    </div>
</body>
</html>
`;

const getTripCreatedEmailTemplate = (trip: TripData): string => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #14b8a6, #0f766e); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; }
        .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .trip-details { background: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .button { display: inline-block; background: #14b8a6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Seu roteiro está pronto!</h1>
        </div>
        <div class="content">
            <h2>Olá, ${trip.userName}!</h2>
            <p>Seu roteiro personalizado para <strong>${trip.destination}</strong> foi criado com sucesso!</p>
            
            <div class="trip-details">
                <h3>📋 Detalhes da Viagem:</h3>
                <p><strong>🏃‍♀️ De:</strong> ${trip.origin}</p>
                <p><strong>🏖️ Para:</strong> ${trip.destination}</p>
                <p><strong>📅 Período:</strong> ${new Date(trip.startDate).toLocaleDateString("pt-BR")} até ${new Date(trip.endDate).toLocaleDateString("pt-BR")}</p>
                <p><strong>💰 Orçamento:</strong> ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: trip.currency }).format(trip.budget)}</p>
            </div>
            
            <p>Sua viagem inclui:</p>
            <ul>
                <li>🗺️ Roteiro detalhado por dia</li>
                <li>🍽️ Recomendações gastronômicas locais</li>
                <li>🌤️ Informações climáticas</li>
                <li>💡 Dicas personalizadas</li>
            </ul>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/trip/${trip.id}" class="button">Ver Meu Roteiro</a>
            
            <p>Boa viagem! 🌟</p>
        </div>
        <div class="footer">
            <p>Taste & Trip - Planeje suas viagens com inteligência artificial</p>
        </div>
    </div>
</body>
</html>
`;

const getTripReminderEmailTemplate = (
  trip: TripData,
  daysUntil: number
): string => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b, #d97706); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; }
        .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .countdown { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
        .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .checklist { background: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⏰ Sua viagem está chegando!</h1>
        </div>
        <div class="content">
            <h2>Olá, ${trip.userName}!</h2>
            
            <div class="countdown">
                <h3>🎊 Faltam apenas ${daysUntil} dias para sua viagem!</h3>
                <p><strong>${trip.destination}</strong> te espera!</p>
            </div>
            
            <p>Que tal dar uma olhada no seu roteiro e se preparar?</p>
            
            <div class="checklist">
                <h3>📝 Checklist de Viagem:</h3>
                <ul>
                    <li>☐ Documentos (RG, passaporte, etc.)</li>
                    <li>☐ Passagens e reservas confirmadas</li>
                    <li>☐ Seguro viagem</li>
                    <li>☐ Medicamentos pessoais</li>
                    <li>☐ Roupas adequadas ao clima</li>
                    <li>☐ Cartão de crédito/débito</li>
                </ul>
            </div>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/trip/${trip.id}" class="button">Revisar Meu Roteiro</a>
            
            <p>Desejamos uma viagem incrível! ✈️</p>
        </div>
        <div class="footer">
            <p>Taste & Trip - Planeje suas viagens com inteligência artificial</p>
        </div>
    </div>
</body>
</html>
`;

const getNewsletterEmailTemplate = (
  userName: string,
  content: NewsletterContent
): string => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8b5cf6, #7c3aed); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; }
        .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .tip-card { background: #f5f3ff; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #8b5cf6; }
        .button { display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💡 ${content.title}</h1>
        </div>
        <div class="content">
            <h2>Olá, ${userName}!</h2>
            <p>Preparamos algumas dicas especiais para você viajar ainda melhor!</p>
            
            ${content.tips
              .map(
                (tip) => `
                <div class="tip-card">
                    <p>${tip}</p>
                </div>
            `
              )
              .join("")}
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Acessar Dashboard</a>
            
            <p>Continue explorando o mundo com a gente! 🌎</p>
        </div>
        <div class="footer">
            <p>Taste & Trip - Planeje suas viagens com inteligência artificial</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe" style="color: #666;">Cancelar assinatura</a></p>
        </div>
    </div>
</body>
</html>
`;

// Função utilitária para verificar configurações de email do usuário
async function shouldSendEmailToUser(): Promise<boolean> {
  // Em um ambiente server-side, não temos acesso ao localStorage
  // Em produção, isso seria verificado no banco de dados
  return true;
}

// ===============================================
// SERVER ACTIONS (Funções Async Exportadas)
// ===============================================

export async function sendWelcomeEmail(user: User): Promise<boolean> {
  try {
    const shouldSend = await shouldSendEmailToUser();
    if (!shouldSend) {
      console.log(
        "Email de boas-vindas não enviado - usuário optou por não receber"
      );
      return false;
    }

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [user.email],
      subject: "🌟 Bem-vindo ao Taste & Trip!",
      html: getWelcomeEmailTemplate(user.name || "Viajante"),
    });

    if (error) {
      console.error("Erro ao enviar email de boas-vindas:", error);
      return false;
    }

    console.log("Email de boas-vindas enviado:", data);
    return true;
  } catch (error) {
    console.error("Erro inesperado no envio de email:", error);
    return false;
  }
}

export async function sendTripCreatedEmail(
  userEmail: string,
  trip: TripData
): Promise<boolean> {
  try {
    const shouldSend = await shouldSendEmailToUser();
    if (!shouldSend) {
      console.log(
        "Email de viagem criada não enviado - usuário optou por não receber"
      );
      return false;
    }

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [userEmail],
      subject: `🎉 Seu roteiro para ${trip.destination} está pronto!`,
      html: getTripCreatedEmailTemplate(trip),
    });

    if (error) {
      console.error("Erro ao enviar email de viagem criada:", error);
      return false;
    }

    console.log("Email de viagem criada enviado:", data);
    return true;
  } catch (error) {
    console.error("Erro inesperado no envio de email:", error);
    return false;
  }
}

export async function sendTripReminderEmail(
  userEmail: string,
  trip: TripData
): Promise<boolean> {
  try {
    const shouldSend = await shouldSendEmailToUser();
    if (!shouldSend) {
      console.log(
        "Lembrete de viagem não enviado - usuário optou por não receber"
      );
      return false;
    }

    const today = new Date();
    const tripDate = new Date(trip.startDate);
    const daysUntil = Math.ceil(
      (tripDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntil <= 0) {
      console.log("Lembrete não enviado - viagem já passou");
      return false;
    }

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [userEmail],
      subject: `⏰ Sua viagem para ${trip.destination} está chegando!`,
      html: getTripReminderEmailTemplate(trip, daysUntil),
    });

    if (error) {
      console.error("Erro ao enviar lembrete de viagem:", error);
      return false;
    }

    console.log("Lembrete de viagem enviado:", data);
    return true;
  } catch (error) {
    console.error("Erro inesperado no envio de email:", error);
    return false;
  }
}

export async function sendNewsletterEmail(
  user: User,
  content: NewsletterContent
): Promise<boolean> {
  try {
    const shouldSend = await shouldSendEmailToUser();
    if (!shouldSend) {
      console.log("Newsletter não enviada - usuário optou por não receber");
      return false;
    }

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [user.email],
      subject: `💡 ${content.title}`,
      html: getNewsletterEmailTemplate(user.name || "Viajante", content),
    });

    if (error) {
      console.error("Erro ao enviar newsletter:", error);
      return false;
    }

    console.log("Newsletter enviada:", data);
    return true;
  } catch (error) {
    console.error("Erro inesperado no envio de email:", error);
    return false;
  }
}

export async function canSendEmailToUser(userEmail: string): Promise<boolean> {
  // Em produção, verificaria no banco de dados as preferências do usuário
  // Por exemplo:
  // const userSettings = await getUserSettingsFromDatabase(userEmail);
  // return userSettings?.emailNotifications ?? true;

  console.log(`Verificando permissão de email para: ${userEmail}`);
  return true; // Default: pode enviar
}

// Função utilitária para testar emails em desenvolvimento
export async function testEmailService(): Promise<void> {
  if (process.env.NODE_ENV === "development") {
    const testUser: User = {
      email: "teste@exemplo.com",
      name: "Usuario Teste",
    };

    const testTrip: TripData = {
      id: "test-123",
      destination: "Paris",
      origin: "São Paulo",
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      budget: 5000,
      currency: "BRL",
      userName: "Usuario Teste",
    };

    console.log("Testando envio de emails...");

    const welcomeResult = await sendWelcomeEmail(testUser);
    console.log("Welcome email:", welcomeResult);

    const tripResult = await sendTripCreatedEmail(testUser.email, testTrip);
    console.log("Trip created email:", tripResult);
  }
}
