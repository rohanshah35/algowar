import { SocialCard } from "@/components/social-card/social-card";
import { Autocomplete } from '@mantine/core';

export default async function Social() {
  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center'
      }}>
        <div style={{ flex: 1, maxWidth: '500px' }}>
          <Autocomplete
              label={
                <span
                  style={{
                    color: "#d4d4d8",
                    fontSize: "11px",
                    fontWeight: "700",
                  }}
                >
                </span>
              }
              name="identifier"
              mb="md"
              placeholder="Search for friends"
              data={[
                'Jane Fingerlicker',
                'John Smith',
                'Sarah Connor',
                'Tony Stark',
                'Bruce Wayne',
                'Peter Parker',
                'Diana Prince',
                'Clark Kent'
              ]}
              styles={{
                input: {
                  backgroundColor: "#27272a",
                  color: "#d4d4d8",
                  border: "1px solid #3f3f46",
                  borderRadius: "4px",
                },
                label: { color: "#f4f4f5" },
                dropdown: {
                  backgroundColor: "#27272a",
                  border: "1px solid #3f3f46",
                },
                option: {
                  color: "#C5C5C5",
                },
              }}
        />
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        marginTop: '40px'
      }}>
        <div style={{ 
          width: '100%',
          maxWidth: '1200px',
          padding: '10px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '30px'
          }}>
            <SocialCard />
            <SocialCard />
            <SocialCard />
            <SocialCard />
            <SocialCard />
            <SocialCard />
            <SocialCard />
            <SocialCard />
            <SocialCard />
            <SocialCard />
            <SocialCard />
            <SocialCard />
            <SocialCard />
            <SocialCard />
            <SocialCard />
            <SocialCard />
            <SocialCard />
            <SocialCard />
            <SocialCard />
            <SocialCard />
          </div>
        </div>
      </div>
    </div>
  )
}