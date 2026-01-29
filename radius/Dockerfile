FROM freeradius/freeradius-server:latest

# Copy custom configuration files
COPY raddb/clients.conf /etc/freeradius/clients.conf
COPY raddb/mods-available/rest /etc/freeradius/mods-available/rest
COPY raddb/sites-enabled/default /etc/freeradius/sites-enabled/default

# Enable required modules
RUN ln -sf /etc/freeradius/mods-available/rest /etc/freeradius/mods-enabled/rest && \
    ln -sf /etc/freeradius/mods-available/mschap /etc/freeradius/mods-enabled/mschap && \
    ln -sf /etc/freeradius/mods-available/chap /etc/freeradius/mods-enabled/chap

# Copy and set up entrypoint
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["freeradius", "-f", "-l", "stdout"]    
