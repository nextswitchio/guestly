"use client";

import TeamMemberList from "@/components/organiser/TeamMemberList";
import InviteTeamMemberForm from "@/components/organiser/InviteTeamMemberForm";
import ActivityFeed from "@/components/organiser/ActivityFeed";
import Card from "@/components/ui/Card";
import Tabs from "@/components/ui/Tabs";

interface TeamCollaborationTabProps {
  eventId: string;
}

export function TeamCollaborationTab({ eventId }: TeamCollaborationTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Team Collaboration</h2>
          <p className="text-foreground-muted mt-1">
            Manage team members and track collaboration activity
          </p>
        </div>
      </div>

      <Tabs
        tabs={[
          {
            id: "members",
            label: "Team Members",
            content: (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <TeamMemberList eventId={eventId} />
                </div>
                <div>
                  <Card padding="lg">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Invite Team Member
                    </h3>
                    <InviteTeamMemberForm eventId={eventId} />
                  </Card>
                </div>
              </div>
            ),
          },
          {
            id: "invitations",
            label: "Invitations",
            content: (
              <Card padding="lg">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Pending Invitations
                </h3>
                <TeamMemberList eventId={eventId} showInvitations />
              </Card>
            ),
          },
          {
            id: "activity",
            label: "Activity Feed",
            content: (
              <Card padding="lg">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Recent Activity
                </h3>
                <ActivityFeed eventId={eventId} />
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
}

export default TeamCollaborationTab;
