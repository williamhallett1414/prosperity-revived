import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Get all reading plan progress with reminders enabled
    const allProgress = await base44.asServiceRole.entities.ReadingPlanProgress.filter({
      reminder_enabled: true
    });

    if (!allProgress || allProgress.length === 0) {
      return Response.json({ 
        message: 'No users with reminders enabled',
        sent: 0 
      });
    }

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const currentHour = now.getHours();
    
    let emailsSent = 0;
    const errors = [];

    for (const progress of allProgress) {
      try {
        if (!progress.reminder_time) continue;

        const [reminderHour] = progress.reminder_time.split(':').map(Number);
        
        // Send if within the same hour window
        if (reminderHour !== currentHour) continue;

        // Get user info
        const users = await base44.asServiceRole.entities.User.filter({
          email: progress.created_by
        });
        
        if (!users || users.length === 0) continue;
        const user = users[0];

        // Calculate next day to read
        const completedDays = progress.completed_days || [];
        const nextDay = progress.current_day || 1;
        const daysRemaining = progress.total_days - completedDays.length;

        if (completedDays.length >= progress.total_days) continue;

        // Get plan details for better email content
        const planName = progress.plan_name || 'Your Reading Plan';

        // Send reminder email
        await base44.asServiceRole.integrations.Core.SendEmail({
          from_name: 'Wellness & Faith',
          to: progress.created_by,
          subject: `📖 Daily Reading Reminder: ${planName}`,
          body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #3C4E53;">Good ${currentHour < 12 ? 'Morning' : currentHour < 18 ? 'Afternoon' : 'Evening'}, ${user.full_name || 'Friend'}!</h2>
              
              <p>It's time for your daily reading from <strong>${planName}</strong>.</p>
              
              <div style="background: #F2F6FA; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #FD9C2D; margin-top: 0;">Today's Reading: Day ${nextDay}</h3>
                <p style="color: #0A1A2F; margin-bottom: 10px;">You're making great progress!</p>
                <div style="background: #fff; height: 8px; border-radius: 4px; overflow: hidden;">
                  <div style="background: linear-gradient(to right, #FD9C2D, #FAD98D); height: 100%; width: ${Math.round((completedDays.length / progress.total_days) * 100)}%;"></div>
                </div>
                <p style="color: #666; font-size: 14px; margin-top: 10px;">
                  ${completedDays.length} of ${progress.total_days} days completed • ${daysRemaining} days remaining
                </p>
              </div>
              
              <p>Take a few moments today to dive into God's Word and continue your spiritual journey.</p>
              
              <a href="${Deno.env.get('BASE_URL') || 'https://app.base44.com'}/Plans" 
                 style="display: inline-block; background: linear-gradient(to right, #FD9C2D, #FAD98D); color: #3C4E53; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px;">
                Continue Reading
              </a>
              
              <p style="color: #999; font-size: 12px; margin-top: 30px;">
                You're receiving this because you enabled reading plan reminders. 
                <a href="${Deno.env.get('BASE_URL') || 'https://app.base44.com'}/Settings" style="color: #FD9C2D;">Manage your reminder settings</a>
              </p>
            </div>
          `
        });

        emailsSent++;
      } catch (error) {
        errors.push({
          user: progress.created_by,
          error: error.message
        });
      }
    }

    return Response.json({
      success: true,
      message: `Reading plan reminders sent`,
      emailsSent,
      totalChecked: allProgress.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});