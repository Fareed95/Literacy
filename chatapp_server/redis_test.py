import redis

try:
    r = redis.StrictRedis.from_url('redis://templet-7zs4.onrender.com')
    r.ping()
    print("Successfully connected to Redis!")
except redis.ConnectionError as e:
    print(f"Failed to connect to Redis: {e}")

# if __name__ == '__main__':
#     print("hello worrld")
