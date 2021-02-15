class netCDF
    def initialize(name)
        @nc = NumRu::NetCDF.create("#{name}.nc", false, false)
    end

    def write
end