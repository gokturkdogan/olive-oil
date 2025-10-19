import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Hoşgeldin maili gönder
 */
export async function sendWelcomeEmail(email: string, name: string) {
  try {
    // Eğer API key yoksa, console'a yaz ve devam et (geliştirme ortamı için)
    if (!process.env.RESEND_API_KEY) {
      console.log('📧 [DEV] Welcome email would be sent to:', email);
      console.log('   Name:', name);
      return { success: true, message: 'Email skipped (no API key)' };
    }

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: [email],
      subject: '🫒 Zeytinyağı Dünyasına Hoş Geldiniz!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Hoş Geldiniz</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #6b8e23 0%, #556b2f 100%); padding: 40px 30px; text-align: center;">
                        <div style="font-size: 60px; margin-bottom: 10px;">🫒</div>
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Hoş Geldiniz!</h1>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="margin: 0 0 20px 0; color: #2d3748; font-size: 22px; font-weight: 600;">
                          Merhaba ${name}! 👋
                        </h2>
                        
                        <p style="margin: 0 0 15px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                          Premium zeytinyağı ailemize katıldığınız için çok mutluyuz! Artık doğal ve sağlıklı ürünlerimizin tadını çıkarabilirsiniz.
                        </p>
                        
                        <p style="margin: 0 0 25px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                          Hesabınız başarıyla oluşturuldu ve artık aşağıdaki avantajlardan yararlanabilirsiniz:
                        </p>
                        
                        <!-- Features -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                          <tr>
                            <td style="padding: 12px; background-color: #f7fafc; border-radius: 8px; margin-bottom: 8px;">
                              <span style="font-size: 20px; margin-right: 10px;">✨</span>
                              <span style="color: #2d3748; font-size: 15px;">Premium kalite zeytinyağı ürünleri</span>
                            </td>
                          </tr>
                          <tr><td style="height: 8px;"></td></tr>
                          <tr>
                            <td style="padding: 12px; background-color: #f7fafc; border-radius: 8px; margin-bottom: 8px;">
                              <span style="font-size: 20px; margin-right: 10px;">🚚</span>
                              <span style="color: #2d3748; font-size: 15px;">Hızlı ve güvenli kargo</span>
                            </td>
                          </tr>
                          <tr><td style="height: 8px;"></td></tr>
                          <tr>
                            <td style="padding: 12px; background-color: #f7fafc; border-radius: 8px; margin-bottom: 8px;">
                              <span style="font-size: 20px; margin-right: 10px;">🎁</span>
                              <span style="color: #2d3748; font-size: 15px;">Sadakat programı ve özel indirimler</span>
                            </td>
                          </tr>
                          <tr><td style="height: 8px;"></td></tr>
                          <tr>
                            <td style="padding: 12px; background-color: #f7fafc; border-radius: 8px;">
                              <span style="font-size: 20px; margin-right: 10px;">📦</span>
                              <span style="color: #2d3748; font-size: 15px;">Kolay sipariş takibi</span>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 0 0 25px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                          Alışverişe başlamak için sitemizi ziyaret edebilirsiniz.
                        </p>
                        
                        <!-- CTA Button -->
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" style="padding: 10px 0;">
                              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/products" 
                                 style="display: inline-block; background: linear-gradient(135deg, #6b8e23 0%, #556b2f 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                                Ürünleri Keşfet 🫒
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px;">
                          Sorularınız için bizimle iletişime geçebilirsiniz.
                        </p>
                        <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                          © ${new Date().getFullYear()} Premium Zeytinyağı. Tüm hakları saklıdır.
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Email send error:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Welcome email sent to:', email);
    return { success: true, data };
  } catch (error: any) {
    console.error('❌ Email send error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sipariş onay maili gönder
 */
export async function sendOrderConfirmationEmail(
  email: string,
  orderData: {
    orderId: string;
    name: string;
    total: number;
    shippingFee: number;
    subtotal: number;
    discount: number;
    shippingAddress: string;
    items: Array<{ title: string; quantity: number; price: number }>;
  }
) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log('📧 [DEV] Order confirmation would be sent to:', email);
      console.log('   Order ID:', orderData.orderId);
      console.log('   Total:', orderData.total / 100, 'TL');
      return { success: true, message: 'Email skipped (no API key)' };
    }

    // Format prices
    const formatPrice = (amount: number) => {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
      }).format(amount / 100);
    };

    // Generate items HTML
    const itemsHtml = orderData.items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="background: linear-gradient(135deg, #6b8e23 0%, #556b2f 100%); border-radius: 8px; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span style="font-size: 24px;">🫒</span>
            </div>
            <div>
              <div style="font-weight: 600; color: #2d3748; margin-bottom: 4px;">${item.title}</div>
              <div style="font-size: 14px; color: #718096;">Adet: ${item.quantity} x ${formatPrice(item.price)}</div>
            </div>
          </div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600; color: #2d3748;">
          ${formatPrice(item.price * item.quantity)}
        </td>
      </tr>
    `).join('');

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: [email],
      subject: `🎉 Siparişiniz Alındı! #${orderData.orderId.substring(0, 8).toUpperCase()}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sipariş Onayı</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Success Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); padding: 40px 30px; text-align: center;">
                        <div style="font-size: 60px; margin-bottom: 15px;">✅</div>
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Siparişiniz Alındı!</h1>
                        <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">
                          Sipariş No: #${orderData.orderId.substring(0, 8).toUpperCase()}
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="margin: 0 0 20px 0; color: #2d3748; font-size: 22px; font-weight: 600;">
                          Merhaba ${orderData.name}! 👋
                        </h2>
                        
                        <p style="margin: 0 0 25px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                          Siparişiniz başarıyla alındı ve en kısa sürede hazırlanmaya başlanacak. Aşağıda sipariş detaylarınızı bulabilirsiniz.
                        </p>
                        
                        <!-- Order Items -->
                        <h3 style="margin: 0 0 15px 0; color: #2d3748; font-size: 18px; font-weight: 600; border-bottom: 2px solid #6b8e23; padding-bottom: 10px;">
                          📦 Sipariş Detayları
                        </h3>
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                          ${itemsHtml}
                        </table>
                        
                        <!-- Price Summary -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px; background-color: #f7fafc; border-radius: 8px; padding: 20px;">
                          <tr>
                            <td style="padding: 8px 0; color: #4a5568; font-size: 15px;">Ara Toplam:</td>
                            <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #2d3748; font-size: 15px;">${formatPrice(orderData.subtotal)}</td>
                          </tr>
                          ${orderData.discount > 0 ? `
                          <tr>
                            <td style="padding: 8px 0; color: #48bb78; font-size: 15px;">İndirim:</td>
                            <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #48bb78; font-size: 15px;">-${formatPrice(orderData.discount)}</td>
                          </tr>
                          ` : ''}
                          <tr>
                            <td style="padding: 8px 0; color: #4a5568; font-size: 15px;">Kargo:</td>
                            <td style="padding: 8px 0; text-align: right; font-weight: 600; color: ${orderData.shippingFee === 0 ? '#48bb78' : '#2d3748'}; font-size: 15px;">
                              ${orderData.shippingFee === 0 ? 'Ücretsiz ✨' : formatPrice(orderData.shippingFee)}
                            </td>
                          </tr>
                          <tr style="border-top: 2px solid #e2e8f0;">
                            <td style="padding: 12px 0 0 0; color: #2d3748; font-size: 18px; font-weight: 700;">Toplam:</td>
                            <td style="padding: 12px 0 0 0; text-align: right; font-weight: 700; color: #6b8e23; font-size: 20px;">${formatPrice(orderData.total)}</td>
                          </tr>
                        </table>
                        
                        <!-- Shipping Address -->
                        <h3 style="margin: 0 0 15px 0; color: #2d3748; font-size: 18px; font-weight: 600; border-bottom: 2px solid #6b8e23; padding-bottom: 10px;">
                          🚚 Teslimat Adresi
                        </h3>
                        <div style="background-color: #f7fafc; padding: 15px; border-radius: 8px; margin-bottom: 30px;">
                          <p style="margin: 0; color: #2d3748; font-size: 15px; line-height: 1.6;">
                            ${orderData.shippingAddress.replace(/\n/g, '<br>')}
                          </p>
                        </div>
                        
                        <!-- Next Steps -->
                        <div style="background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%); padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                          <h4 style="margin: 0 0 15px 0; color: #2d3748; font-size: 16px; font-weight: 600;">
                            📋 Sıradaki Adımlar
                          </h4>
                          <ul style="margin: 0; padding-left: 20px; color: #4a5568; font-size: 14px; line-height: 1.8;">
                            <li>Siparişiniz hazırlanacak ve kalite kontrolünden geçecek</li>
                            <li>Kargoya verildiğinde size bilgilendirme yapılacak</li>
                            <li>Takip numaranız e-posta ile gönderilecek</li>
                            <li>Tahmini teslimat süresi: 2-3 iş günü</li>
                          </ul>
                        </div>
                        
                        <!-- CTA Buttons -->
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" style="padding: 10px 0;">
                              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/profile/orders" 
                                 style="display: inline-block; background: linear-gradient(135deg, #6b8e23 0%, #556b2f 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); margin: 5px;">
                                Siparişlerimi Görüntüle
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px;">
                          Sorularınız için bizimle iletişime geçebilirsiniz.
                        </p>
                        <p style="margin: 0 0 15px 0; color: #a0aec0; font-size: 12px;">
                          Bu mail ${email} adresine sipariş onayı olarak gönderilmiştir.
                        </p>
                        <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                          © ${new Date().getFullYear()} Premium Zeytinyağı. Tüm hakları saklıdır.
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Order confirmation email error:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Order confirmation email sent to:', email, '| Order:', orderData.orderId);
    return { success: true, data };
  } catch (error: any) {
    console.error('❌ Order email error:', error);
    return { success: false, error: error.message };
  }
}

