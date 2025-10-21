import os
import time
import requests




def ping_url(url, delay, max_trials): 
  trials = 0

  while trials < max_trials:
      try:
          response = requests.get(url)
          if response.status_code == 200:
              print(f"Successfully reached {url}")
              return True
          else:
              print(f"Failed to reach {url}, status code: {response.status_code}")
      except requests.RequestException as e:
          print(f"Error reaching {url}: {e}")
      
      trials += 1
      if trials < max_trials:
          print(f"Retrying in {delay} seconds... ({max_trials - trials} attempts left)")
          time.sleep(delay)

  print(f"Failed to reach {url} after {max_trials} attempts.")
  return False

def run():
  url = os.getenv("INPUT_URL")
  delay = int(os.getenv("INPUT_DELAY", "5"))
  max_trials = int(os.getenv("INPUT_MAX_TRIALS", "10"))


  website_reachable = ping_url(url, delay, max_trials)

  output_file = os.getenv("GITHUB_OUTPUT")
  open(output_file, "a").write(f"url-reachable={website_reachable}\n")

  if not website_reachable:
    raise Exception(f"Could not reach {url} after {max_trials} attempts.")

  print(f"Website {url} is reachable.")

if __name__ == "__main__":
  run()